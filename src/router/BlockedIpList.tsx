import { Route } from "react-router-dom";
import BlockedIpList from "../pages/BlockedIpList/BlockedIpList";

export const BlockedIp = () => (
  <>
    <Route path="/blocked-ip-list" element={<BlockedIpList />} />
  </>
);