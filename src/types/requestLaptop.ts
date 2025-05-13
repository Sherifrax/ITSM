// src/types/requestLaptop.ts
export enum RequestLaptopUrls {
  Start = "mr/api/process/start",
  UpdateStatus = "mr/api/process/update-status",
  GetByCreatedFor = "mr/api/process/created-for",
  GetByCreatedBy = "mr/api/process/created-by"
}

// In your services/requestLaptop.ts
export enum ApiBaseName {
  BASE_URL = "http://10.20.20.54:8080/", 
  GRAFANA_BASE_URL = "http://localhost:3000/"
}

export interface Employee {
  empNumber: string;
  empName: string;
  email: string;
}

export interface RequestStatus {
  status: string;
  statusId: number;
  remarks: string;
}
export interface RequestLaptop {
  requestId: string; // Add this property if it exists in the data
  summitMetaData?: {
    ticketNo?: number;
    summitAiCustomFields?: Array<{
      AttributeName: string;
      AttributeValue: string;
    }>;
  };
  subject: string;
  requestStatus: {
    status: string;
  };
  createdBy: {
    empName: string;
  };
  createdDate: string;
}

export interface CreateRequestPayload {
  createdBy: Employee;
  createdFor: Employee; // Add this
  subject: string;
  requestType: string; // Add this
  summitMetaData: { // Add this
    summitAiCustomFields: {
      GroupName: string;
      AttributeName: string;
      AttributeValue: string;
    }[];
  };
}

// In your types/requestLaptop.ts
export interface SummitAiCustomField {
  GroupName: string;
  AttributeName: string;
  AttributeValue: string;
}

export interface SummitMetaData {
  summitAiCustomFields: SummitAiCustomField[];
}

export interface CreateRequestPayload {
  createdBy: Employee;
  createdFor: Employee;
  subject: string;
  requestType: string;
  summitMetaData: SummitMetaData;
  ticketNo: string;
}
export enum RequestLaptopStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  REJECTED = 'Rejected'
}

export enum RequestLaptopStatusId {
  PENDING = 1,
  IN_PROGRESS = 2,
  COMPLETED = 3,
  REJECTED = 4
}