export enum CitizenStatus {
	Safe = "safe",
	AtRisk = "at_risk",
	InDanger = "in_danger",
}

export type Location = {
	longitude: number;
	latitude: number;
	address: number;
};

export type Reporter = {
	id: string;
	createdAt: string;
	name: string;
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
