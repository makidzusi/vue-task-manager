export type Column = {
  id: number;
  sort: number;
  name: string;
  code: string;
};

export type Project = {
  id: number;
  code: string;
  name: string;
  sort: number;
};

export type Task = {
  id: number;
  title: string;
  stage: string;
  project: string | false;
  score: number;
};
