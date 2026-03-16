"use client";

import { useRef } from "react";
import Image from "next/image";
import { observer } from "mobx-react-lite";
import { useServer } from "@/hooks/useServer";
import PaginatedTableWrapper, {
  PaginatedTableWrapperHandle,
} from "../properties-list/PaginatedTableWrapper";

export interface AgentListItem {
  id: string;
  name: string;
  email: string;
  referral_code?: string;
  roles?: string;
  profile_image?: string;
  iban?: string;
}

interface AgentsTableBodyProps {
  filterSearch?: string;
  filterReferralCode?: string;
  loadEnabled?: boolean;
  refreshKey?: number;
  onPreview?: (agent: AgentListItem) => void;
  onEdit?: (agent: AgentListItem) => void;
}

const AgentsTableBody = ({
  filterSearch = "",
  filterReferralCode = "",
  loadEnabled = true,
  refreshKey = 0,
  onPreview,
  onEdit,
}: AgentsTableBodyProps) => {
  const { sendRequest } = useServer();
  const paginationRef = useRef<PaginatedTableWrapperHandle>(null);

  const fetchData = async (page: number, perPage: number) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("per_page", String(perPage));
    const search = filterSearch?.trim();
    const referralCode = filterReferralCode?.trim();
    if (search) params.set("search", search);
    if (referralCode) params.set("search", referralCode);

    const response = await sendRequest(`/user/list-agents?${params.toString()}`);
    if (response?.status && response?.data != null) {
      const raw = response.data;
      const list = raw?.users ?? raw?.data ?? [];
      const pagination = raw?.pagination ?? {
        current_page: page,
        last_page: 1,
        per_page: perPage,
        total: list.length ?? 0,
      };
      return {
        data: Array.isArray(list) ? list : [],
        pagination: {
          current_page: pagination.current_page ?? page,
          last_page: pagination.last_page ?? 1,
          per_page: pagination.per_page ?? perPage,
          total: pagination.total ?? 0,
        },
      };
    }
    return {
      data: [],
      pagination: { current_page: 1, last_page: 1, per_page: perPage, total: 0 },
    };
  };

  const renderRows = (agents: AgentListItem[]) => (
    <>
      {agents.map((agent) => (
        <tr className="listing-table" key={agent.id}>
          <td className="center">
            <Image
              src={agent.profile_image || "/assets/img/dashboard/avatar_01.jpg"}
              alt={agent.name ?? ""}
              width={44}
              height={44}
              className="rounded-circle m-auto"
              style={{ objectFit: "cover" }}
              unoptimized
            />
          </td>
          <td className="center">{agent.name ?? "—"}</td>
          <td className="center">{agent.email ?? "—"}</td>
          <td className="center">{agent.referral_code ?? "—"}</td>
          <td className="center">{agent.iban ?? "—"}</td>
          <td className="center">
            <span className="badge bg-success px-3 py-2">Agent</span>
          </td>
          <td className="center">
            <div className="action-dots float-end">
              <button
                className="action-btn dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span></span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button className="dropdown-item" onClick={() => onPreview?.(agent)}>
                    <i className="fas fa-eye me-2" /> Preview
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => onEdit?.(agent)}>
                    <i className="fas fa-pencil me-2" /> Edit
                  </button>
                </li>
              </ul>
            </div>
          </td>
        </tr>
      ))}
    </>
  );

  const filterKey = `${filterSearch}-${filterReferralCode}-${refreshKey}`;

  return (
    <tbody className="border-0">
      <PaginatedTableWrapper
        ref={paginationRef}
        fetchData={fetchData}
        renderRows={(data) => renderRows(data as AgentListItem[])}
        initialPerPage={10}
        filterKey={filterKey}
        loadEnabled={loadEnabled}
      />
    </tbody>
  );
};

export default observer(AgentsTableBody);
