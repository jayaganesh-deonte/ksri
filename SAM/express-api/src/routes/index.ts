import express from "express";
import { helloRoute } from "./HelloRoute";
import { milestonesRoute } from "./milestones";
import { projectRoute } from "./projects";
import { traditionalScholarRoute } from "./TraditionalScholarRoute";

import { foreignScholarRoute } from "./foreignScholars";
import { studentRoute } from "./students";

import { endownmentRoute } from "./contribute/endownments";
import { eventRoute } from "./events/events";
import { newsRoute } from "./news";

import { governingBodyMembersRoute } from "./governingBodyMembers";
import { governingBodyMembersPastRouter } from "./governingBodyMembersPast";

import { articleRoute } from "./library/articles";
import { bookRoute } from "./library/books";
import { journalRoute } from "./library/journals";

import { publicationBookRoute } from "./publications/book";
import { publicationsCommitteeRouter } from "./publications/committee";

import { facultyRouter } from "./faculty";

import { collectionsRoute } from "./gallery/collections";
import { galleryRoute } from "./gallery/gallery";

export const routes = express.Router();

routes.use(helloRoute);
routes.use(milestonesRoute);
routes.use(projectRoute);
routes.use(traditionalScholarRoute);
routes.use(foreignScholarRoute);
routes.use(studentRoute);

routes.use(endownmentRoute);
routes.use(eventRoute);
routes.use(newsRoute);

routes.use(governingBodyMembersRoute);
routes.use(governingBodyMembersPastRouter);

routes.use(articleRoute);
routes.use(bookRoute);
routes.use(journalRoute);

routes.use(publicationBookRoute);
routes.use(publicationsCommitteeRouter);

routes.use(facultyRouter);

routes.use(collectionsRoute);
routes.use(galleryRoute);
