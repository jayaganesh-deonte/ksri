import express from "express";
import { helloRoute } from "./HelloRoute";
import { milestonesRoute } from "./milestones";
import { projectRoute } from "./projects";
import { projectSeriesRoute } from "./projectSeries";
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
import { additionalPublicationsRoute } from "./publications/additionalPublications";
import { publicationJournalRoute } from "./publications/journals";

import { facultyRouter } from "./faculty";

import { collectionsRoute } from "./gallery/collections";
import { galleryRoute } from "./gallery/gallery";

import { supervisorRoute } from "./supervisor";

import { researchArticlesRoute } from "./researchArticles";

import { dainandiniRouter } from "./dainandini";
import { homeDialogRouter } from "./homeDialog";
import { marqueeTextsRouter } from "./marqueeTexts";

import { userRoute } from "./user";

import { bankInfoRoute } from "./contribute/bankInfo";
import { postalAddressRoute } from "./contribute/postalAddress";

import { chairRouter } from "./chair";

import { facultyDesignationRouter } from "./facultyDesignations";

import { deployRoute } from "./publish_website";

import { dashboardRoute } from "./dashboard";

import { advisoryBoardRouter } from "./advisoryBoard";

export const routes = express.Router();

routes.use(helloRoute);
routes.use(milestonesRoute);
routes.use(projectRoute);
routes.use(projectSeriesRoute);
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
routes.use(additionalPublicationsRoute);
routes.use(publicationJournalRoute);

routes.use(facultyRouter);

routes.use(collectionsRoute);
routes.use(galleryRoute);

routes.use(supervisorRoute);

routes.use(researchArticlesRoute);

routes.use(dainandiniRouter);
routes.use(homeDialogRouter);
routes.use(marqueeTextsRouter);

routes.use(userRoute);

routes.use(bankInfoRoute);
routes.use(postalAddressRoute);

routes.use(chairRouter);

routes.use(facultyDesignationRouter);

routes.use(deployRoute);
routes.use(dashboardRoute);

routes.use(advisoryBoardRouter);
