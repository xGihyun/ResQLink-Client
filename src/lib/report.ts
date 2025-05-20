export enum CitizenStatus {
	Safe = "safe",
	AtRisk = "at_risk",
	InDanger = "in_danger",
}

export type Location = {
	longitude: number;
	latitude: number;
	address?: string;
};

export type Reporter = {
	id: string;
	createdAt: string;
	name: string;
};

export type InitResponder = {
	name: string;
	userId?: string;
};

export type Responder = {
	id: string;
	createdAt: string;
	name: string;
};

export type BasicReport = {
	id: string;
	createdAt: string;
	updatedAt: string;
	status: CitizenStatus;
	reporter: Reporter;
	responder?: Responder;
	location?: Location;
};

export type Report = {
	rawSituation: string;
	aiGenSituation: string;
	photoUrls: string[];
} & BasicReport;

export type UserReport = {
	id: string;
	createdAt: string;
	updatedAt: string;
	status: CitizenStatus;
	responder?: Responder;
	location?: Location;
	rawSituation: string;
	aiGenSituation: string;
	photoUrls: string[];
};

export type SaveLocationRequest = {
	location: Location;
	reporterId: string;
};

export type ReportsByReporter = {
	reports: UserReport[];
	reporter: Reporter;
	location?: Location;
};

export type SetResponderRequest = {
	reporterId: string;
	responder: InitResponder;
};

export type SetResponderResponse = {
	reporterId: string;
	responder: Responder;
};

export type CreateReportRequest = {
	userId?: string;
	name: string;
	status: CitizenStatus;
	rawSituation: string;
	photoUrls: string[];
};
