// src/types/requestLaptop.ts
export enum RequestLaptopUrls {
  START = "mr/api/process/start",
  UPDATE_STATUS = "mr/api/process/update-status",
  GET_BY_CREATED_FOR = "mr/api/process/created-for",
  GET_BY_CREATED_BY = "mr/api/process/created-by",
  GET_ASSIGNED_TO = "mr/api/process/assigned-to"
}

export enum RequestType {
  LAPTOP_REQUEST = "1"
}

export enum RequestStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN PROGRESS",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED"
}

export enum RequestStatusId {
  PENDING = 1,
  IN_PROGRESS = 5, 
  COMPLETED = 3,
  REJECTED = 4
}

export enum SummitAiCustomFieldGroup {
  REQUEST_DETAILS = "Request Details"
}

export enum SummitAiCustomFieldName {
  MODEL = "Model"
}

export interface Employee {
  empNumber: string;
  empName: string;
  email: string;
}

export interface SummitAiCustomField {
  GroupName: SummitAiCustomFieldGroup;
  AttributeName: SummitAiCustomFieldName | string;
  AttributeValue: string;
}

export interface SummitMetaData {
  ticketNo?: number;
  message?: string;
  status?: string;
  summitAiCustomFields: SummitAiCustomField[];
}

export interface RequestStatusDetail {
  status: RequestStatus | string;
  statusId: RequestStatusId | number;
  remarks?: string;
}

export interface Approver {
  empNumber: string;
  empName?: string;
  email?: string;
  taskId: string;
  lastUpdated: string;
  currentStatus: string;
  currentStatusId: number;
  remarks?: string;
}

// src/types/requestLaptop.ts
export interface CreateRequestPayload {
  file?: string; // Optional file field
  mrRequestData: {
    createdBy: Employee;
    createdFor: Employee;
    subject: string;
    requestTypeId: string;
    summitMetaData: SummitMetaData;
    // These fields are optional and will be filled by the server
    requestId?: string;
    camundaProcessInstanceId?: string;
    createdDate?: string;
    approverList?: Approver[];
    requestStatus?: RequestStatusDetail;
  };
}

export interface RequestLaptop {
  requestId: string;
  subject: string;
  requestStatus: {
    status: string;
  };
  createdBy: {
    empName: string;
  };
  createdDate: string;
  summitMetaData?: {
    ticketNo?: number;
    ticketStatus?: string;
    status?: string;
    summitAiCustomFields?: {
      AttributeName: string;
      AttributeValue: string;
    }[];
  };
}