//todo未完成
import { useState, useEffect } from "react";
import { GraphDifferenceInfo, EndpointDataTypeDifferenceInfo } from "../classes/DiffDisplayUtils";
import TEndpointDataType from "../entities/TEndpointDataType";

type Props = {
  nodeId: string | null;
  graphDifferenceInfo: GraphDifferenceInfo;
  oldEndpointDatatypeMap: Record<string, TEndpointDataType>;
  newEndpointDatatypeMap: Record<string, TEndpointDataType>;
};

export default function DiffDetailEndpoint({
  nodeId,
  graphDifferenceInfo,
  oldEndpointDatatypeMap,
  newEndpointDatatypeMap,
}: Props) {
  if (!nodeId) return null;

  const diffInfoMap = graphDifferenceInfo.diffInfoMap;
  const diffInfo: EndpointDataTypeDifferenceInfo | undefined = diffInfoMap.get(nodeId);

  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // 當 nodeId 或 responseSchemaDiffStatusCodes 改變時，重設 selectedStatus 為第一個差異狀態碼
  useEffect(() => {
    if (diffInfo && diffInfo.responseSchemaDiffStatusCodes.length > 0) {
      setSelectedStatus(diffInfo.responseSchemaDiffStatusCodes[0]);
    } else {
      setSelectedStatus(null);
    }
  }, [nodeId, diffInfo?.responseSchemaDiffStatusCodes]);

  if (!diffInfo) {
    return (
      <div>
        <h3>No difference information for endpoint: {nodeId}</h3>
      </div>
    );
  }

  // 取得新舊版本該 endpoint 的 schema，方便展示
  const oldEndpoint = oldEndpointDatatypeMap[nodeId];
  const newEndpoint = newEndpointDatatypeMap[nodeId];

  // 找出對應 status 的 schema
  const findSchemaByStatus = (endpoint: TEndpointDataType | undefined, status: string) => {
    if (!endpoint) return null;
    return endpoint.schemas.find((s) => s.status === status) || null;
  };

  const oldSchema = selectedStatus ? findSchemaByStatus(oldEndpoint, selectedStatus) : null;
  const newSchema = selectedStatus ? findSchemaByStatus(newEndpoint, selectedStatus) : null;

  return (
    <div style={{ border: "1px solid #ccc", padding: 16, borderRadius: 8, maxWidth: 700 }}>
      <h3>Change Details for Endpoint: {nodeId}</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={{ fontWeight: "bold", padding: "8px", borderBottom: "1px solid #ddd" }}>
              Request Schema
            </td>
            <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
              {diffInfo.isRequestSchemaEqual ? "No Change" : (
                <>
                  <div><b>Old:</b></div>
                  <pre style={{ background: "#f4f4f4", padding: 8 }}>{oldEndpoint?.schemas.find(s => s.status.startsWith("2"))?.requestSchema || ``}</pre>
                  <div><b>New:</b></div>
                  <pre style={{ background: "#f4f4f4", padding: 8 }}>{newEndpoint?.schemas.find(s => s.status.startsWith("2"))?.requestSchema || ``}</pre>
                </>
              )}
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", padding: "8px", borderBottom: "1px solid #ddd", verticalAlign: "top" }}>
              Response Schema Changes
            </td>
            <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
              {diffInfo.responseSchemaDiffStatusCodes.length === 0 ? (
                "No Change"
              ) : (
                <>
                  <div style={{ marginBottom: 8 }}>
                    {diffInfo.responseSchemaDiffStatusCodes.map((status) => (
                      <label key={status} style={{ marginRight: 12, cursor: "pointer" }}>
                        <input
                          type="radio"
                          name="responseStatus"
                          value={status}
                          checked={selectedStatus === status}
                          onChange={() => setSelectedStatus(status)}
                        />{" "}
                        {status}
                      </label>
                    ))}
                  </div>
                  <div>
                    <b>Old Schema ({selectedStatus}):</b>
                    <pre style={{ background: "#f4f4f4", padding: 8, maxHeight: 150, overflow: "auto" }}>
                      {oldSchema?.responseSchema || ``}
                    </pre>
                  </div>
                  <div>
                    <b>New Schema ({selectedStatus}):</b>
                    <pre style={{ background: "#f4f4f4", padding: 8, maxHeight: 150, overflow: "auto" }}>
                      {newSchema?.responseSchema || ``}
                    </pre>
                  </div>
                </>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
