import React from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Typography,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSquarePlus,
  faSquareMinus,
} from '@fortawesome/free-regular-svg-icons';
import { faSquarePen } from '@fortawesome/free-solid-svg-icons';
import { Color } from '../classes/ColorUtils';

const HexagonIcon = ({ serviceNodeId }: { serviceNodeId: string }) => {
  const color = Color.generateFromString(serviceNodeId).hex;
  const textColor = Color.fromHex(color)!.decideForeground()!.hex;
  const size = 40;
  const centerX = 50;
  const centerY = 50;
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    const x = centerX + size * Math.cos(angle);
    const y = centerY + size * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="45" height="45" viewBox="0 0 100 100">
      <polygon points={points} fill={color} />
      <text
        x="50"
        y="60"
        textAnchor="middle"
        fontSize="30"
        fill={textColor}
        pointerEvents="none"
      >
        SVC
      </text>
    </svg>
  );
};

const CircleIcon = ({ serviceNodeId }: { serviceNodeId: string }) => {
  const color = Color.generateFromString(serviceNodeId).hex;
  const textColor = Color.fromHex(color)!.decideForeground()!.hex;
  return (
    <svg width="45" height="45" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" fill={color} />
      <text
        x="50"
        y="60"
        textAnchor="middle"
        fontSize="30"
        fill={textColor}
        pointerEvents="none"
      >
        EP
      </text>
    </svg>
  );
};

const getServiceNodeId = (nodeId: string) =>
  nodeId.split('\t').slice(0, 2).join('\t');

const formatServiceNodeId = (serviceNodeId: string) =>
  serviceNodeId.split('\t').join('.');

const formatEndpointNodeId = (nodeId: string) => {
  const parts = nodeId.split('\t');
  const version = parts[2] || '';
  const method = parts[3] || '';
  const path = parts[4] || '';
  return `(${version}) ${method} ${path}`;
};

type Props = {
  addedNodeIds: string[];
  deletedNodeIds: string[];
  changedEndpointNodesId: string[];
  showEndpoint: boolean;
};

const renderIcon = (type: 'add' | 'delete' | 'change') => {
  const config = {
    add: {
      icon: faSquarePlus,
      color: 'rgba(0, 255, 0, 0.7)',
    },
    delete: {
      icon: faSquareMinus,
      color: 'rgba(255, 0, 0, 0.7)',
    },
    change: {
      icon: faSquarePen,
      color: 'rgba(255, 165, 0, 0.7)',
    },
  };
  const { icon, color } = config[type];
  return <FontAwesomeIcon icon={icon} style={{ color, fontSize: 18 }} />;
};

export default function DiffMenu({
  addedNodeIds,
  deletedNodeIds,
  changedEndpointNodesId,
  showEndpoint,
}: Props) {
  const addedServiceNodesSet = new Set(addedNodeIds.map(getServiceNodeId));
  const deletedServiceNodesSet = new Set(deletedNodeIds.map(getServiceNodeId));

  const filterServiceNodes = (nodeIds: string[], serviceNodesSet: Set<string>) =>
    nodeIds.filter(
      (nodeId) =>
        serviceNodesSet.has(getServiceNodeId(nodeId)) &&
        nodeId === getServiceNodeId(nodeId)
    );

  const filterEndpointNodes = (nodeIds: string[], serviceNodesSet: Set<string>) =>
    nodeIds.filter(
      (nodeId) =>
        serviceNodesSet.has(getServiceNodeId(nodeId)) &&
        nodeId !== getServiceNodeId(nodeId)
    );

  // 服務分類
  const addedServices = filterServiceNodes(addedNodeIds, addedServiceNodesSet);
  const deletedServices = filterServiceNodes(deletedNodeIds, deletedServiceNodesSet);

  // 端點分類
  const addedEndpoints = filterEndpointNodes(addedNodeIds, addedServiceNodesSet);
  const deletedEndpoints = filterEndpointNodes(deletedNodeIds, deletedServiceNodesSet);

  // === render Services ===
  const renderServiceList = () => {
    const allServices = [
      ...addedServices.map((id) => ({ id, type: 'add' as const })),
      ...deletedServices.map((id) => ({ id, type: 'delete' as const })),
    ];
    if (allServices.length === 0) return null;

    return (
      <>
        <Typography variant="h6" sx={{ mb: 1, mt: 1 }}>
          Services
        </Typography>
        <Divider sx={{ mb: 2, borderTop: '3px solid #999' }} />
        <List
          dense
          sx={{ bgcolor: 'white', mb: 2, borderRadius: 1, boxShadow: 1 }}
        >
          {allServices.map(({ id, type }, idx) => (
            <ListItem
              key={`${type}-service-${id}`}
              sx={{ borderBottom: idx !== allServices.length - 1 ? '1px solid #ccc' : 'none' }}
            >
              <Box sx={{ width: 24, textAlign: 'center', mr: 1 }}>
                {renderIcon(type)}
              </Box>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <HexagonIcon serviceNodeId={id} />
              </ListItemIcon>
              <ListItemText
                primary={formatServiceNodeId(id)}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </>
    );
  };

  // === render Endpoints 分組 ===
  const renderEndpointList = () => {
    if (!showEndpoint) return null;
  
    const groupByService = (items: { id: string; type: 'add' | 'delete' | 'change' }[]) => {
      return items.reduce<Record<string, { id: string; type: 'add' | 'delete' | 'change' }[]>>(
        (acc, cur) => {
          const svcId = getServiceNodeId(cur.id);
          if (!acc[svcId]) acc[svcId] = [];
          acc[svcId].push(cur);
          return acc;
        },
        {}
      );
    };
  
    const allEndpoints = [
      ...addedEndpoints.map((id) => ({ id, type: 'add' as const })),
      ...deletedEndpoints.map((id) => ({ id, type: 'delete' as const })),
      ...changedEndpointNodesId.map((id) => ({ id, type: 'change' as const })),
    ];
  
    if (allEndpoints.length === 0) return null;
  
    const groupedEndpoints = groupByService(allEndpoints);
  
    return (
      <>
        <Typography variant="h6" sx={{ mb: 1, mt: 4 }}>
          Endpoints
        </Typography>
        <Divider sx={{ mb: 2, borderTop: '3px solid #999' }} />
  
        {Object.entries(groupedEndpoints).map(([serviceId, endpoints]) => (
          <Box key={`ep-group-${serviceId}`} sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              {formatServiceNodeId(serviceId)}
            </Typography>
            <List dense sx={{ bgcolor: 'white', borderRadius: 1, boxShadow: 1 }}>
              {endpoints.map(({ id, type }, idx) => (
                <ListItem
                  key={`${type}-endpoint-${id}`}
                  sx={{ borderBottom: idx !== endpoints.length - 1 ? '1px solid #ccc' : 'none' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Box sx={{ width: 24, textAlign: 'center', mr: 1, flexShrink: 0 }}>
                      {renderIcon(type)}
                    </Box>
                    <ListItemIcon sx={{ minWidth: 36, flexShrink: 0 }}>
                      <CircleIcon serviceNodeId={serviceId} />
                    </ListItemIcon>
                    <Box
                      sx={{
                        flexGrow: 1,
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                      }}
                      title={formatEndpointNodeId(id)}
                    >
                      <Typography component="span" sx={{ fontSize: '0.8rem' }}>
                        {formatEndpointNodeId(id)}
                      </Typography>
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
      </>
    );
  };
  

  return (
    <div style={{ maxHeight: '100%', backgroundColor: '#fafafa', padding: '0.2em 0.1em' }}>
      {renderServiceList()}
      {renderEndpointList()}
    </div>
  );
}
