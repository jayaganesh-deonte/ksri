import { ulid } from "ulidx";

import { batchInsert, insertIntoDynamoDB } from "./ddb";

const generateMetaData = () => {
  return {
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: "admin",
    updated_by: "admin",
  };
};

import { toDynamoDB } from "../models/contribute/endownments";
import { toDynamoDB as eventsToDynamoDB } from "../models/events/events";

import {
  toDynamoDB as libArticleToDynamoDB,
  validateArticle,
} from "../models/library/articles";
import {
  toDynamoDB as libBookToDynamoDB,
  validateBook,
  isBookDDB,
} from "../models/library/books";
import {
  toJournalDDB as libJournalToDynamoDB,
  validateJournal,
} from "../models/library/journals";

import {
  toDynamoDB as pubBookToDynamoDB,
  validateBook as validationPublicationBook,
} from "../models/publications/book";

import {
  toDynamoDB as pubJournalToDynamoDB,
  validateJournal as validatePublicationJournal,
} from "../models/publications/journals";

import {
  toDynamoDB as pubCommitteeToDynamoDB,
  validateCommitteeMember as validatePublicationCommittee,
} from "../models/publications/committee";

import {
  toDynamoDB as foreignScholarsToDynamoDB,
  validateForeignScholar as validateForeignScholar,
  ForeignScholar,
} from "../models/foreignScholars";

import {
  TraditionalScholar,
  toDynamoDB as traditionalScholarsToDynamoDB,
  validateTraditionalScholar as validateTraditionalScholar,
} from "../models/traditionalScholars";

import {
  Student,
  toDynamoDB as studentsToDynamoDB,
  validateStudent as validateStudent,
} from "../models/students";

import {
  Faculty,
  toDynamoDB as facultyToDynamoDB,
  validateFaculty as validateFaculty,
} from "../models/faculty";

import {
  GalleryImage,
  toDynamoDB as galleryToDynamoDB,
  validateGalleryImage as validateGalleryImage,
} from "../models/gallery/gallery";

import {
  Milestone,
  toDynamoDB as milestonesToDynamoDB,
  isMilestoneDDB,
} from "../models/milestones";

import {
  News,
  toDynamoDB as newsToDynamoDB,
  validateNews as validateNews,
} from "../models/news";

import {
  Project,
  toDynamoDB as projectsToDynamoDB,
  validateProject as validateProject,
} from "../models/projects";

import {
  ResearchArticle,
  toDynamoDB as researchArticlesToDynamoDB,
  validateResearchArticle as validateResearchArticle,
} from "../models/researchArticles";

import {
  GoverningBodyMember,
  toDynamoDB as governingBodyMembersToDynamoDB,
  validateGoverningBodyMember as validateGoverningBodyMember,
} from "../models/governingBodyMembers";

import {
  GoverningBodyMemberPast,
  toDynamoDB as governingBodyMembersPastToDynamoDB,
  validateGoverningBodyMemberPast as validateGoverningBodyMemberPast,
} from "../models/governingBodyMembersPast";
import { writeFileSync } from "fs";

const insertEndownments = async () => {
  // load content/contribute/endownments.json file into endownments variable
  const endownments = require("./content/contribute/endownments.json");
  console.log(endownments);

  // import endowment model

  // add id to endownments
  const endownmentsWithId = endownments.map((endowment: any) => ({
    ...endowment,
    id: ulid(),
    itemPublishStatus: "PUBLISHED",
    metadata: generateMetaData(),
  }));

  // convert endownments to dynamoDB format
  const endownmentsDynamoDB = endownmentsWithId.map((endowment) =>
    toDynamoDB(endowment)
  );

  console.log(endownmentsDynamoDB);

  // insert endownments into dynamoDB
  await batchInsert(endownmentsDynamoDB);
};

const insertEvents = async () => {
  // load events
  const events = require("./content/events/generated_events.json");
  // add id to events
  const eventsWithId = events.map((event: any) => ({
    ...event,
    id: ulid(),
    itemPublishStatus: "PUBLISHED",
    metadata: generateMetaData(),
    // convert images to array of strings
    images: event.images.map((image: any) => image.src),
  }));
  // convert events to dynamoDB format
  const eventsDynamoDB = eventsWithId.map((event) => eventsToDynamoDB(event));
  // insert events into dynamoDB
  await batchInsert(eventsDynamoDB);
};

const insertLibraryArticles = async () => {
  // load articles
  const articles = require("./library/articles.json");
  //   {
  //     "Title": "Introducing Tenessee Williams",
  //     "Author": "Mahajan M L",
  //     "Journal": "Nagpur University Journal (Humanities)",
  //     "Vol_No": "XIX",
  //     "year": "1968-69",
  //     "Remarks": ""
  // },

  // add id to articles
  const articlesWithId = articles.map((article: any) => ({
    title: article.Title,
    author: article.Author,
    journal: article.Journal,
    volume: article.Vol_No.toString(),
    year: article.year.toString(),
    remarks: article.Remarks,
    id: ulid(),
    itemPublishStatus: "PUBLISHED",
    metadata: generateMetaData(),
  }));

  // validate articles
  articlesWithId.forEach((article) => {
    if (!validateArticle(article)) {
      return console.log("Invalid article", article);
    }
  });

  // convert articles to dynamoDB format
  const articlesDynamoDB = articlesWithId.map((article) =>
    libArticleToDynamoDB(article)
  );
  // console.log(articlesDynamoDB);
  // insert articles into dynamoDB
  await batchInsert(articlesDynamoDB);
};

const insertLibraryBooks = async () => {
  // load books
  const books = require("./library/books.json");

  console.log(books[0]);

  //   {
  //     "AccessionNumber": "0",
  //     "BookTitle": "Cultural Heritage of IndiaVol.VI.[Science and Technology]",
  //     "Author": "",
  //     "Editor": "",
  //     "Publisher": "Kolikatha: R.K.Math",
  //     "Remarks": ""
  // },

  const booksWithId = books.map((book: any) => ({
    accessionNo: book.AccessionNumber.toString(),
    title: book.BookTitle,
    author: book.Author,
    editor: book.Editor,
    publisher: book.Publisher,
    remarks: book.Remarks,
    id: ulid(),
    itemPublishStatus: "PUBLISHED",
    metadata: generateMetaData(),
  }));
  // console.log(booksWithId);

  // remove books without title from booksWithId
  const booksWithIdFiltered = booksWithId.filter(
    (book: any) => book.title !== ""
  );

  // validate books
  booksWithIdFiltered.forEach((book) => {
    if (!validateBook(book)) {
      return console.log("Invalid book", book);
    }
  });
  // convert books to dynamoDB format
  const booksDynamoDB = booksWithIdFiltered.map((book) =>
    libBookToDynamoDB(book)
  );

  // check isBookDDB
  // booksDynamoDB.forEach((book) => {
  //   if (!isBookDDB(book)) {
  //     console.log("Invalid book", book);
  //     return console.log("Invalid book", book);
  //   }
  // });

  // console.log(booksDynamoDB);
  await batchInsert(booksDynamoDB);
};

const insertLibraryJournals = async () => {
  // load journals
  const journals = require("./library/journals.json");
  // add id to journals
  const journalsWithId = journals.map((journal: any) => ({
    ...journal,
    id: ulid(),
    itemPublishStatus: "PUBLISHED",
    metadata: generateMetaData(),
  }));

  // validate journals
  journalsWithId.forEach((journal) => {
    if (!validateJournal(journal)) {
      return console.log("Invalid journal", journal);
    }
  });

  // convert journals to dynamoDB format
  const journalsDynamoDB = journalsWithId.map((journal) =>
    libJournalToDynamoDB(journal)
  );

  // insert journals into dynamoDB
  await batchInsert(journalsDynamoDB);
};

const insertPublicationBooks = async () => {
  // load books
  const books = require("./content/publications/books.json");
  // add id to books
  const booksWithId = books.map((book: any) => ({
    ...book,
    id: ulid(),
    itemPublishStatus: "PUBLISHED",
    metadata: generateMetaData(),
    available: "Yes",
    copies: "10",
  }));

  // remove books without title from booksWithId
  const booksWithIdFiltered = booksWithId.filter(
    (book: any) => book.title !== ""
  );

  // validate books
  booksWithIdFiltered.forEach((book) => {
    if (!validationPublicationBook(book)) {
      return console.log("Invalid book", book);
    }
  });

  // convert books to dynamoDB format
  const booksDynamoDB = booksWithIdFiltered.map((book) =>
    pubBookToDynamoDB(book)
  );

  // insert books into dynamoDB
  await batchInsert(booksDynamoDB);
};

const insertPublicationJournals = async () => {
  // load journals
  const journals = require("./content/publications/journals.json");
  // add id to journals

  // {
  //   "author": " ",
  //   "available": "Yes",
  //   "copies": 10,
  //   "details": "<p>“This issue of The Journal; of Oriental Research is that it commemorates the birth centenary of Prof. V. Raghavan, a doyen of Indological studies. The corpus of the journal is divided into two parts. In the first part homage is paid to Professor Raghavan by four reputed scholars. In the second we find twenty articles written by different scholars on various aspects of Sanskrit learning. There are also a number of articles dealing with Sanskrit literature and literary criticism.  The articles, excellent in nature and diverse in subject matter, are undoubtedly the best flowers of the mental gardens of the scholars by which they have paid their homage to the immortal soul of Professor Raghavan”.\\nSitanath Acharya, Bulletin of the Ramakrishna Mission, Institute of Culture, 2011</p>",
  //   "entityType": "ENTITYTYPE#PUBLICATION#JOURNAL",
  //   "imageUrls": [
  //     {
  //       "S": "upload/the-journal-of-oriental-research-madras-2009-10.jpg"
  //     }
  //   ],
  //   "keywords": " ",
  //   "price": "₹ 300",
  //   "publication": "KSRI",
  //   "subtitle": "Dr. V. Raghavan Birth Centenary Commemoration Volume | The Kuppuswami Sastri Research Institute, Madras | 2000",
  //   "title": "THE JOURNAL OF ORIENTAL RESEARCH MADRAS (Vols. LXXI - LXXXII 2009-2010)",
  //   "yearOfPublication": 2010
  // }

  // update imageUrls to be an array of strings remove S

  const journalsWithId = journals.map((journal: any) => ({
    ...journal,
    id: ulid(),
    itemPublishStatus: "PUBLISHED",
    metadata: generateMetaData(),
    imageUrls: journal.imageUrls.map((image: any) => image.S),
  }));

  // validate journals
  journalsWithId.forEach((journal) => {
    if (!validatePublicationJournal(journal)) {
      return console.log("Invalid journal", journal);
    }
  });

  // convert journals to dynamoDB format
  const journalsDynamoDB = journalsWithId.map((journal) =>
    pubJournalToDynamoDB(journal)
  );

  // insert journals into dynamoDB
  await batchInsert(journalsDynamoDB);
};

const insertAllPublicationBooks = async () => {
  //   {
  //     "author": "",
  //     "available": "Yes",
  //     "copies": 10,
  //     "details": "Muttoḷḷāyiram, the Tamil classic with translations into Sanskrit and English. Comprises of a collection of 108 choice verses found quoted at different places in the anthology entitled pura-t-tirattu. All these verses form eulogies on the rulers of the three ancient Tamil kingdoms of Pāndya, Cera, Cola in South India, suggestive of their qualities of love, philanthrophy and valour and have a distinct charm of their own. The book is provided with an informative Introduction, Notes and Glossary. It attempts to familiarise the norms and charms of early poetry to students of literature outside the land of Tamils.    “The transcomposition of Muttoḷḷāyiram is very ‘pleasing and instructive'. The language is handled causually, thus making it simple for the readers. It is hoped that this small but mammoth work will open up avenues of Tamil study to many people of the world.”\\nS.B.Darsana, Bulletin, The DCPRI  53.",
  //     "entityType": "ENTITYTYPE#BOOK",
  //     "imageUrls": [
  //         {
  //             "S": "https://d30y75l38k1y9.cloudfront.net/upload/navamuktatakam.jpg"
  //         }
  //     ],
  //     "keywords": "",
  //     "price": "₹ 85",
  //     "publication": "KSRI",
  //     "subtitle": "Trans composition into Sanskrit and English Verse from the Tamil Classic Muttoḷḷāyiram by A.V. Subramanian  |  The Kuppuswami Sastri Research Institute, Madras   |  1993  |  Pages: xxix + 121",
  //     "title": "NAVAMUKTĀŚATAKAM",
  //     "yearOfPublication": ""
  // },
  const books = require("./content/publications/allbooks.json");

  // add id to books
  const booksWithId = books.map((book: any) => ({
    ...book,
    id: ulid(),
    itemPublishStatus: "PUBLISHED",
    metadata: generateMetaData(),
    imageUrls: book.imageUrls
      ? book.imageUrls.map((image: any) => image.S)
      : null,
  }));

  // validate books
  booksWithId.forEach((book) => {
    if (!validationPublicationBook(book)) {
      return console.log("Invalid book", book);
    }
  });

  // convert books to dynamoDB format
  const booksDynamoDB = booksWithId.map((book) => pubBookToDynamoDB(book));

  // insert books into dynamoDB
  await batchInsert(booksDynamoDB);
};

const insertPublicationCommittee = async () => {
  // load json file
  const committee = require("./content/publications/committee.json");

  console.log(committee);

  // get designations from committee keys
  const designations = Object.keys(committee);

  let committeeMembers: any = [];

  for (const designation of designations) {
    const members = committee[designation];

    for (const member of members) {
      const committeeMember = {
        id: ulid(),
        itemPublishStatus: "PUBLISHED",
        name: member.name,
        designation,
        metadata: generateMetaData(),
      };

      if (!validatePublicationCommittee(committeeMember as any)) {
        return console.log("Invalid committee member", committeeMember);
      }

      committeeMembers.push(pubCommitteeToDynamoDB(committeeMember as any));
    }

    console.log(committeeMembers);
  }
  await batchInsert(committeeMembers);
};

const insertForeignScholars = async () => {
  // load json file
  const scholars: ForeignScholar[] = require("./content/scholars_gateway/foreignScholars.json");

  // add id to scholars
  const scholarsWithId = scholars.map((scholar: any) => ({
    ...scholar,
    id: ulid(),
    itemPublishStatus: "PUBLISHED",
    metadata: generateMetaData(),
  }));

  // validate scholars
  scholarsWithId.forEach((scholar) => {
    if (!validateForeignScholar(scholar)) {
      return console.log("Invalid scholar", scholar);
    }
  });

  // convert scholars to dynamoDB format
  const scholarsDynamoDB = scholarsWithId.map((scholar) =>
    foreignScholarsToDynamoDB(scholar)
  );

  console.log(scholarsDynamoDB);
  // insert scholars into dynamoDB
  await batchInsert(scholarsDynamoDB);
};

const insertshastrachudamanis = async () => {
  // load json file
  const scholars: TraditionalScholar[] = require("./content/scholars_gateway/shastrachudamanis.json");
  // add id to scholars
  const scholarsWithId = scholars.map((scholar: any) => ({
    ...scholar,
    id: ulid(),
    itemPublishStatus: "PUBLISHED",
    metadata: generateMetaData(),
    type: "Shastrachudamani",
  }));

  // validate scholars
  scholarsWithId.forEach((scholar) => {
    if (!validateTraditionalScholar(scholar)) {
      return console.log("Invalid scholar", scholar);
    }
  });
  // convert scholars to dynamoDB format
  const scholarsDynamoDB = scholarsWithId.map((scholar) =>
    traditionalScholarsToDynamoDB(scholar)
  );
  // insert scholars into dynamoDB
  await batchInsert(scholarsDynamoDB);
};

const insertvidyavaridhis = async () => {
  // load json file
  const scholars: TraditionalScholar[] = require("./content/scholars_gateway/vidyavaridhis.json");
  // add id to scholars
  const scholarsWithId = scholars.map((scholar: any) => ({
    ...scholar,
    id: ulid(),
    itemPublishStatus: "PUBLISHED",
    metadata: generateMetaData(),
    type: "Vidyavaridhi",
  }));
  // validate scholars
  scholarsWithId.forEach((scholar) => {
    if (!validateTraditionalScholar(scholar)) {
      return console.log("Invalid scholar", scholar);
    }
  });
  // convert scholars to dynamoDB format
  const scholarsDynamoDB = scholarsWithId.map((scholar) =>
    traditionalScholarsToDynamoDB(scholar)
  );
  // insert scholars into dynamoDB
  await batchInsert(scholarsDynamoDB);
};

const insertTraditionalScholars = async () => {
  // load json file
  const scholars: TraditionalScholar[] = require("./content/scholars_gateway/traditional.json");
  // add id to scholars
  const scholarsWithId = scholars.map((scholar: any) => ({
    ...scholar,
    id: ulid(),
    itemPublishStatus: "PUBLISHED",
    metadata: generateMetaData(),
    type: "Traditional Study",
  }));
  // validate scholars
  scholarsWithId.forEach((scholar) => {
    if (!validateTraditionalScholar(scholar)) {
      return console.log("Invalid scholar", scholar);
    }
  });
  // convert scholars to dynamoDB format
  const scholarsDynamoDB = scholarsWithId.map((scholar) =>
    traditionalScholarsToDynamoDB(scholar)
  );
  // insert scholars into dynamoDB
  await batchInsert(scholarsDynamoDB);
};

const insertStudents = async () => {
  let allStudents: Student[] = [];
  // load present students
  const presentStudents: Student[] = require("./content/students/present/students.json");

  const presentStudentsWithId = presentStudents.map((student: any) => ({
    ...student,
    id: ulid(),
    itemPublishStatus: "PUBLISHED",
    metadata: generateMetaData(),
    status: "On-Going",
  }));

  allStudents = allStudents.concat(presentStudentsWithId);

  // load past/mphil students
  const pastMphilStudents: Student[] = require("./content/students/past/mphil.json");

  const pastMphilStudentsWithId = pastMphilStudents.map((student: any) => ({
    ...student,
    id: ulid(),
    itemPublishStatus: "PUBLISHED",
    metadata: generateMetaData(),
    status: "Completed",
  }));
  allStudents = allStudents.concat(pastMphilStudentsWithId);

  // load past/phd students
  const pastPhdStudents: Student[] = require("./content/students/past/phd.json");

  const pastPhdStudentsWithId = pastPhdStudents.map((student: any) => ({
    ...student,
    id: ulid(),
    itemPublishStatus: "PUBLISHED",
    metadata: generateMetaData(),
    status: "Completed",
  }));
  allStudents = allStudents.concat(pastPhdStudentsWithId);

  // validate present students
  allStudents.forEach((student) => {
    if (!validateStudent(student)) {
      return console.log("Invalid student", student);
    }
  });

  // convert present students to dynamoDB format
  const allStudentsDDB = allStudents.map((student) =>
    studentsToDynamoDB(student)
  );

  // insert present students into dynamoDB
  await batchInsert(allStudentsDDB);
};

const insertfaculty = async () => {
  // load faculty
  const faculty: Faculty[] = require("./content/faculty.json");

  // add id to faculty
  const facultyWithId = faculty.map((faculty: any) => ({
    ...faculty,
    id: ulid(),
    itemPublishStatus: "PUBLISHED",
    metadata: generateMetaData(),
    displayImage: [faculty.displayImage],
    profile: [faculty.profile],
  }));

  // validate faculty
  facultyWithId.forEach((faculty) => {
    if (!validateFaculty(faculty)) {
      return console.log("Invalid faculty", faculty);
    }
  });

  // convert faculty to dynamoDB format
  const facultyDynamoDB = facultyWithId.map((faculty) =>
    facultyToDynamoDB(faculty)
  );

  // insert faculty into dynamoDB
  await batchInsert(facultyDynamoDB);
};

const insertGallery = async () => {
  // load gallery
  const gallery: any = require("./content/gallery.json");

  //   {
  //     "gallery": {
  //         "KSRI Gallery Collection 1": {
  //             "imageUrl": "upload/1.jpg",
  //             "description": "Inaugration of the KSRInstitute by S.V.Ramamurthi I.C.S. on 22nd April 1945. L.to R.: K.M.Munshi, Sir.S.V.Ramamurthi, Rt.Hon'ble V.S. Srinivasa Sastri & Dr. S. Radhakrishnan"
  //         },
  //         "Memories of KSRI": [
  //             {
  //                 "imageUrl": "upload/1.jpg",
  //                 "description": "Inaugration of the KSRInstitute by S.V.Ramamurthi I.C.S. on 22nd April 1945. L.to R.: K.M.Munshi, Sir.S.V.Ramamurthi, Rt.Hon'ble V.S. Srinivasa Sastri & Dr. S. Radhakrishnan"
  //             }
  //         ]
  //     }
  // }

  // get gallery collection names
  const galleryCollectionNames = Object.keys(gallery["gallery"]);
  console.log(galleryCollectionNames);

  let galleryItems: any[] = [];

  for (const galleryCollectionName of galleryCollectionNames) {
    const galleryItemsInGalleryCollection =
      gallery["gallery"][galleryCollectionName];
    console.log(galleryItemsInGalleryCollection);

    for (const galleryItem of galleryItemsInGalleryCollection) {
      galleryItems.push({
        collection: galleryCollectionName,
        imageUrl: [galleryItem.imageUrl],
        description: galleryItem.description,
        id: ulid(),
        itemPublishStatus: "PUBLISHED",
        metadata: generateMetaData(),
      });
    }
  }

  // validate gallery
  galleryItems.forEach((galleryItem) => {
    if (!validateGalleryImage(galleryItem)) {
      return console.log("Invalid galleryItem", galleryItem);
    }
  });

  // convert gallery to dynamoDB format
  const galleryDynamoDB = galleryItems.map((galleryItem) =>
    galleryToDynamoDB(galleryItem)
  );
  console.log(galleryDynamoDB);

  // insert gallery into dynamoDB
  await batchInsert(galleryDynamoDB);
};

const insertmilestones = async () => {
  // load milestones
  const milestones: Milestone[] = require("./content/milestones.json");

  // add id to milestones
  const milestonesWithId = milestones.map((milestone: any) => ({
    ...milestone,
    id: ulid(),
    itemPublishStatus: "PUBLISHED",
    metadata: generateMetaData(),
  }));

  // validate milestones
  milestonesWithId.forEach((milestone) => {
    if (!isMilestoneDDB(milestone)) {
      return console.log("Invalid milestone", milestone);
    }
  });

  // convert milestones to dynamoDB format
  const milestonesDynamoDB = milestonesWithId.map((milestone) =>
    milestonesToDynamoDB(milestone)
  );

  // console.log(milestonesDynamoDB);
  // insert milestones into dynamoDB
  await batchInsert(milestonesDynamoDB);
};

const insertNews = async () => {
  // load news
  const news: News[] = require("./content/news.json");

  // add id to news
  const newsWithId = [];
  for (const newsItem of news) {
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log(newsItem);

    newsWithId.push({
      ...newsItem,
      id: ulid(),
      itemPublishStatus: "PUBLISHED",
      metadata: generateMetaData(),
      avatarImage: [newsItem.avatarImage],
      heading_image_url: [newsItem.heading_image_url],
    });
  }

  // validate news
  newsWithId.forEach((news) => {
    if (!validateNews(news)) {
      return console.log("Invalid news", news);
    }
  });

  // convert news to dynamoDB format
  const newsDynamoDB = newsWithId.map((news) => newsToDynamoDB(news));

  console.log(newsDynamoDB);
  // insert news into dynamoDB
  await batchInsert(newsDynamoDB);
};

const insertProjects = async () => {
  // load projects
  const projects: any[] = require("./content/projects.json");

  const projectStatus = ["Completed", "On-Going", "Future Projects"];

  let allProjects: any[] = [];

  for (const status of projectStatus) {
    let projectWithStauts = projects[status as any].map((project: any) => ({
      ...project,
      status,
      id: ulid(),
      itemPublishStatus: "PUBLISHED",
      metadata: generateMetaData(),
    }));
    allProjects = allProjects.concat(projectWithStauts);
  }

  // validate projects
  allProjects.forEach((project) => {
    if (!validateProject(project)) {
      return console.log("Invalid project", project);
    }
  });

  // convert projects to dynamoDB format
  const projectsDynamoDB = allProjects.map((project) =>
    projectsToDynamoDB(project)
  );

  console.log(projectsDynamoDB);
  // insert projects into dynamoDB
  await batchInsert(projectsDynamoDB);
};

const insertResearchArticles = async () => {
  // load research articles
  const researchArticles: ResearchArticle[] = require("./content/researcharticles.json");

  // add id to research articles
  const researchArticlesWithId = researchArticles.map(
    (researchArticle: any) => ({
      ...researchArticle,
      id: ulid(),
      itemPublishStatus: "PUBLISHED",
      metadata: generateMetaData(),
      link: [researchArticle.link],
    })
  );

  // validate research articles
  researchArticlesWithId.forEach((researchArticle) => {
    if (!validateResearchArticle(researchArticle)) {
      return console.log("Invalid research article", researchArticle);
    }
  });

  // convert research articles to dynamoDB format
  const researchArticlesDynamoDB = researchArticlesWithId.map(
    (researchArticle) => researchArticlesToDynamoDB(researchArticle)
  );

  console.log(researchArticlesDynamoDB);
  // insert research articles into dynamoDB
  await batchInsert(researchArticlesDynamoDB);
};

const insertpresentGoverningBodyMembers = async () => {
  // load presentGoverningBodyMembers
  const presentGoverningBodyMembers: any[] =
    require("./content/governingbodymembers/present.json")[0];

  console.log(presentGoverningBodyMembers);

  const designations = Object.keys(presentGoverningBodyMembers);

  for (const designation of designations) {
    const members = presentGoverningBodyMembers[designation];
    const membersWithDesignation = members.map((member: any) => ({
      ...member,
      designation,
      orderid: member.orderid.toString(),
      id: ulid(),
      itemPublishStatus: "PUBLISHED",
      metadata: generateMetaData(),
    }));

    const membersWithDesignationDDB = membersWithDesignation.map(
      (member: any) => governingBodyMembersToDynamoDB(member)
    );

    console.log(membersWithDesignationDDB);
    await batchInsert(membersWithDesignationDDB);
  }
};

const insertGoveringBodyPast = async () => {
  // load pastGoverningBodyMembers
  const pastGoverningBodyMembers: any[] =
    require("./content/governingbodymembers/past.json")[0];

  console.log(pastGoverningBodyMembers);

  const designations = Object.keys(pastGoverningBodyMembers);

  for (const designation of designations) {
    const members = pastGoverningBodyMembers[designation];
    const membersWithDesignation = members.map((member: any) => ({
      ...member,
      designation,
      id: ulid(),
      itemPublishStatus: "PUBLISHED",
      metadata: generateMetaData(),
    }));

    const membersWithDesignationDDB = membersWithDesignation.map(
      (member: any) => governingBodyMembersPastToDynamoDB(member)
    );

    // console.log(membersWithDesignationDDB);
    await batchInsert(membersWithDesignationDDB);
  }
};

const insertsamskritaacademypublicationsBooks = async () => {
  // load samskritaacademypublicationsBooks
  const samskritaacademypublicationsBooks: any[] = require("./content/publications/samskritaacademypublications.json");
  console.log(samskritaacademypublicationsBooks);

  // with ids
  const samskritaacademypublicationsBooksWithId =
    samskritaacademypublicationsBooks.map(
      (samskritaacademypublicationsBook: any) => ({
        ...samskritaacademypublicationsBook,
        id: ulid(),
        itemPublishStatus: "PUBLISHED",
        metadata: generateMetaData(),
        available: "Yes",
        copies: "10",
        publication: "Samskrita Academy",
      })
    );

  // convert samskritaacademypublicationsBooks to dynamoDB format
  const samskritaacademypublicationsBooksDynamoDB =
    samskritaacademypublicationsBooksWithId.map(
      (samskritaacademypublicationsBook: any) =>
        pubBookToDynamoDB(samskritaacademypublicationsBook)
    );
  console.log(samskritaacademypublicationsBooksDynamoDB);

  // insert samskritaacademypublicationsBooks into dynamoDB
  await batchInsert(samskritaacademypublicationsBooksDynamoDB);
};

const insertOutOfStockPubBooks = async (filename, available) => {
  // load outofstock.json
  // const outofstock: any[] = require("./content/publications/outofstock.json");
  const outofstock: any[] = require(`./content/publications/${filename}.json`);
  // console.log(outofstock);
  let booksWIthIds = [];

  for (const book of outofstock) {
    const bookWithId = {
      title: book,
      id: ulid(),
      itemPublishStatus: "PUBLISHED",
      metadata: generateMetaData(),
      available: available,
      copies: "10",
      publication: "KSRI",
    };

    booksWIthIds.push(bookWithId);
  }
  console.log(booksWIthIds);

  // convert outofstock to dynamoDB format
  const outofstockDynamoDB = booksWIthIds.map((book: any) =>
    pubBookToDynamoDB(book)
  );
  console.log(outofstockDynamoDB);

  // insert outofstock into dynamoDB
  await batchInsert(outofstockDynamoDB);
};

const eventsFromAdminApp = async () => {
  // load events.json
  const events = require("./content/from_admin/events.json");

  // Sample events  from admin
  //   {
  //     "id": "180",
  //     "title": "National Seminar on Vedāṅgas and Upavedas",
  //     "description": "THE SAMSKRITA ACADEMY MADRAS & THE KUPPUSWAMI SASTRI RESEARCH INSTITUTE jointly organized a two-day NATIONAL SEMINAR ON UPAVEDAS & VEDANGAS on 22nd & 23rd NOVEMBER, 2024. ",
  //     "content": "<p class=\"ql-align-center\">Friday, 22nd November 2024&nbsp;<!slash!p><h5 class=\"ql-align-center\"><strong class=\"ql-size-large\">INAUGURATION - 10.00 a.m. - 10.30 a.m.&nbsp;<!slash!strong><!slash!h5><p class=\"ql-align-center\"><strong>SRI KOMBUR RAMABHADRAN ENDOWMENT&nbsp;<!slash!strong><!slash!p><p class=\"ql-align-center\"><br><!slash!p><p class=\"ql-align-center\">Dr. A. VASUDEVACHARIAR<!slash!p><p class=\"ql-align-center\">(Founder &amp; Principal, Sri Malola Samskrta Vidyapeetam,&nbsp;<!slash!p><p class=\"ql-align-center\">Veda Vedanta Gurukulam, Kancheepuram )&nbsp;<!slash!p><p class=\"ql-align-center\"><br><!slash!p><p class=\"ql-align-center\">received the&nbsp;<!slash!p><p class=\"ql-align-center\"><br><!slash!p><p class=\"ql-align-center\">KOMBUR RAMABHADRAN CASH AWARD&nbsp;<!slash!p><p class=\"ql-align-center\"><br><!slash!p><p class=\"ql-align-center\">Dr. R.K. RAGHAVAN<!slash!p><p class=\"ql-align-center\">(President, The Kuppuswami Sastri Research Institute, Chennai)&nbsp;<!slash!p><p class=\"ql-align-center\">presided over the Session 1.<!slash!p><p class=\"ql-align-center\"><br><!slash!p><p class=\"ql-align-center\"><br><!slash!p><p class=\"ql-align-center\"><strong>VEDĀṄGA I<!slash!strong><!slash!p><p class=\"ql-align-center\"><strong>Śikṣā, Nirukta &amp; Vyākaraṇa<!slash!strong><!slash!p><p class=\"ql-align-center\"><strong>Friday 22.11.2024<!slash!strong><!slash!p><p class=\"ql-align-center\"><strong>Session I – 10.30 AM – 1.00 PM<!slash!strong><!slash!p><p class=\"ql-align-center\"><strong>Chairperson: Dr.O.R.Devanathan<!slash!strong><!slash!p><p class=\"ql-align-center\"><strong>(Head &amp; Prof. of PG &amp; Research, Dept. of Sanskrit, Presidency College)<!slash!strong><!slash!p><p><strong>1.Dr.S.S.Mukundan <!slash!strong><!slash!p><p>Assistant Professor,<!slash!p><p>Sri AhobilaMutt Adarsh Sanskrit MahaVidyalaya,<!slash!p><p>Madhurantakam<!slash!p><p><strong>व्याकरणवैशिष्ट्यम् <!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>2. Dr.K.Shyamasundara<!slash!strong><!slash!p><p>Associate Professor of Vyakarana,<!slash!p><p>The Madras Sanskrit College, Chennai<!slash!p><p><strong> वेदाङ्गेषु व्याकरणस्य स्थानम्<!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>3. R. Sridhar<!slash!strong><!slash!p><p>Assistant Professor, Department of Vyakarana,<!slash!p><p>Sri Ahobila Mutt Adarsh Sanskrit Mahavidyalaya, Madurantakam<!slash!p><p><strong> मुखं व्याकरणं स्मृतम्<!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>4.V Rajagopalan,<!slash!strong><!slash!p><p>Assistant Professor,<!slash!p><p>Sri Ahobila Mutt Adarsh Sanskrit Mahavidyalaya, Madurantakam<!slash!p><p><strong> षडङ्गेषु व्याकरणस्य प्रयोजनम्<!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>5.Dr M Uma Maheswari,<!slash!strong><!slash!p><p>Assistant Professor &amp; Head<!slash!p><p>Queen Mary's College (Autonomous), Chennai 600004<!slash!p><p><strong>Vedāṅga Śikṣā in Purāṇas<!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>6.Dr. Mayank Pandey,<!slash!strong><!slash!p><p>Assistant Professor<!slash!p><p>SCSVMV University, Enathur<!slash!p><p><strong>परमदण्डिनौ इत्यत्र णत्ववारणपरस्य प्राचीननव्यवैयाकरणग्रन्थस्य समीक्षणम्<!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>7.Dr. Shubh Chandra Jha,<!slash!strong><!slash!p><p>Assistant Professor<!slash!p><p>SCSVMV University, Enathur<!slash!p><p><strong>संज्ञाविधौ प्रत्ययग्रहणे तदन्तग्रहणं नास्तीति परिभाषाविचारः<!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>8.Babhrabi Ghosh,<!slash!strong><!slash!p><p>Research Scholar,<!slash!p><p>Pondicherry University<!slash!p><p><strong>पाणिनिव्याकरणहरिनामामृतव्याकरणयोः तोलनम् (संज्ञा-सन्धि-कारकसूत्राणां सन्दर्भे)<!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>&nbsp;9.Dr.S.Thirumalai,<!slash!strong><!slash!p><p>Assistant Professor in Sahitya,<!slash!p><p>Sri Ahobila Mutt Adarsh Sanskrit Mahavidyalaya Madhurantakam<!slash!p><p><strong><em>Vedāṅgasya<!slash!em>&nbsp;<em>āvaśyakatā<!slash!em><!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>10.K.Bhuvaneshwari,<!slash!strong><!slash!p><p>Research Scholar, The KSRI<!slash!p><p><strong>The use of stories as pedagogical tool in the Nirukta <!slash!strong><!slash!p><p>&nbsp;<!slash!p><p class=\"ql-align-center\"><strong>VEDĀṄGA II<!slash!strong><!slash!p><p class=\"ql-align-center\"><strong>Kalpa, Chandas &amp; Jyotiṣa<!slash!strong><!slash!p><p class=\"ql-align-center\"><strong>Session II – 2.00 PM – 4.30 PM<!slash!strong><!slash!p><p class=\"ql-align-center\"><strong>Chairperson: Dr.V.Ramakrishnan<!slash!strong><!slash!p><p class=\"ql-align-center\"><strong>(Asst. Prof. of Advaita Vedanta, The Madras Sanskrit College)<!slash!strong><!slash!p><p><strong> 1. Dr Jayalakshmi V<!slash!strong><!slash!p><p>Assistant Professor,<!slash!p><p>Sree Sankaracharya University of Sanskrit, Kalady<!slash!p><p>&nbsp;<!slash!p><p><strong> <em>Jyotiṣaśāstrasya<!slash!em> <em>prādhānyam<!slash!em><!slash!strong><!slash!p><p><br><!slash!p><p><strong>2. Arya V C<!slash!strong><!slash!p><p>Research Scholar,<!slash!p><p>Sree Sankaracharya University of Sanskrit, Kalady<!slash!p><p><strong>&nbsp;Astronomy and its relevance to Vedic study<!slash!strong><!slash!p><p><br><!slash!p><p><strong> Jayashri M<!slash!strong><!slash!p><p>Research Scholar,<!slash!p><p>Sastra Deemed University<!slash!p><p><strong> Significance of Venus in forecast of rainfall<!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>Dr. V. Sowmyanarayanan<!slash!strong><!slash!p><p>Assistant Professor &amp; Head, DG Vaishnav College, Chennai<!slash!p><p><strong> छन्दः पादौ तु वेदस्य<!slash!strong><!slash!p><p><span style=\"color: red;\">&nbsp;<!slash!span><!slash!p><p><strong style=\"color: red;\">&nbsp;<!slash!strong><strong>Dr.S.Umapathi, <!slash!strong><!slash!p><p>Associate Professor,<!slash!p><p>The Madras Sanskrit College, Mylapore, Chennai<!slash!p><p><strong>वृत्तानि<!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>S. Amruthavalli,<!slash!strong><!slash!p><p>Ph.D Research Scholar,<!slash!p><p>Srimad Andavan Arts and Science College, Trichy<!slash!p><p><strong> सुभाषितकौस्तुभे छन्दोऽध्ययनम्<!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>R.Lakshminarasimhan,<!slash!strong><!slash!p><p>Assistant Professor,<!slash!p><p>Sri Ahobila Mutt Adarsh Sanskrit Mahavidyalaya, Madurantakam<!slash!p><p><strong>Chandas in Deśika Kṛtis<!slash!strong><!slash!p><p>&nbsp;<!slash!p><p>&nbsp;<!slash!p><p><strong>Dr. K.Bhuvaneswari<!slash!strong><!slash!p><p>Research Scholar,<!slash!p><p>Sastra Deemed University, Thanjavur<!slash!p><p><strong>Jyotishic principles in <em>Kumārasambhava<!slash!em> of Kālidāsa<!slash!strong><!slash!p><p>&nbsp;<!slash!p><p class=\"ql-align-center\"><strong>Upaveda I<!slash!strong><!slash!p><p class=\"ql-align-center\"><strong>Arthaśāstra &amp; Gandharvaveda<!slash!strong><!slash!p><p class=\"ql-align-center\"><strong>Session III – 10.30 AM – 1.00 PM<!slash!strong><!slash!p><p class=\"ql-align-center\"><strong>Saturday 23.11.2024<!slash!strong><!slash!p><p class=\"ql-align-center\"><strong>Chairperson: Dr.V.Kameswari<!slash!strong><!slash!p><p class=\"ql-align-center\"><strong>(Former Director, The Kuppuswami Sastri Research Institute)<!slash!strong><!slash!p><p><strong> S Sumathi<!slash!strong><!slash!p><p>Assistant Professor, Dept. of Sanskrit,<!slash!p><p>Bishop Heber College, Trichy<!slash!p><p><strong> Upavedas – The Multi-Disciplinary Fields<!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>Priyamvada Kannan, <!slash!strong><!slash!p><p>Ph.D Research Scholar,<!slash!p><p>Presidency College ( Autonomous), Chennai<!slash!p><p><strong> Gandharva Veda (<em>Saṅgītaratnākara<!slash!em> -Śārñgadeva)<!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>Jinu Reachel, <!slash!strong><!slash!p><p>Research Scholar,<!slash!p><p>Sree Sankaracharya University of Sanskrit, Kalady<!slash!p><p><strong> The Strategic Importance of Fort Constructions in <em>Arthaśāstra<!slash!em> <!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>Mrs.M.Sivapriya,<!slash!strong><!slash!p><p>Assistant Professor, Dept. of Sanskrit,<!slash!p><p>Bishop Heber College, Trichy<!slash!p><p><strong> संस्कृतदृश्यकाव्ये सङ्गीतस्य उपयोगिता विशेषिता:<!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>R.Gayathri,<!slash!strong><!slash!p><p>Research Scholar,<!slash!p><p>The KSRI<!slash!p><p><strong>Types of fraudulent acts in the preparation and maintenance of accounts in <em>Arthaśāstra<!slash!em><!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>Lavannia Velayudhan,<!slash!strong><!slash!p><p>Research Scholar,<!slash!p><p>Sree Sankaracharya University of Sanskrit, Kalady<!slash!p><p><strong>Courtesans in ancient India: Insights from <em>Arthaśāstra<!slash!em> <!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>Varsha Gopi,<!slash!strong><!slash!p><p>Research Scholar,<!slash!p><p>Sree Sankaracharya University of Sanskrit, Kalady<!slash!p><p><strong>Marriage and property rights of Women in Kauṭilya's <em>Arthaśāstra<!slash!em><!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>R.Rajalakshmi, <!slash!strong><!slash!p><p>Ph.D Research Scholar,<!slash!p><p>The Madras Sanskrit College<!slash!p><p><strong>गान्धर्वविद्याप्रभावः<!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>R.Chitra,<!slash!strong><!slash!p><p>Asst. Prof. JBAS College for Women<!slash!p><p><strong>Trade and Commerce in <em>Arthaśāstra<!slash!em><!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>S.Sugantha,<!slash!strong><!slash!p><p>Asst. Prof.,<!slash!p><p>SDNB Vaishnava College, Chrompet<!slash!p><p><strong> “Siege of the Fort”- According to <em>Arthaśāstra<!slash!em> <!slash!strong><!slash!p><p>&nbsp;&nbsp;<!slash!p><p><strong>V.R.Srinivasan&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!slash!strong><!slash!p><p>Research Scholar,<!slash!p><p>The KSRI<!slash!p><p><strong>Spying in <em>Arthaśāstra<!slash!em><!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>&nbsp;R.Ramya Bhatt<!slash!strong><!slash!p><p>Asst. Prof.,<!slash!p><p>Guru Nanak College, Chennai<!slash!p><p><strong>&nbsp;Gandharva Veda in <em>Vāyu Purāṇa<!slash!em><!slash!strong><!slash!p><p>&nbsp;<!slash!p><p class=\"ql-align-center\"><strong>Upaveda II<!slash!strong><!slash!p><p class=\"ql-align-center\"><strong>Dhanurveda &amp; Āyurveda <!slash!strong><!slash!p><p class=\"ql-align-center\"><strong>Session IV: 2.00 PM – 4.00 PM<!slash!strong><!slash!p><p class=\"ql-align-center\"><strong>Chairperson: Dr.L.Kumaraswamy<!slash!strong><!slash!p><p class=\"ql-align-center\"><strong>(Former Prof. &amp; Head, Dept. of Sanskrit, D.G.Vaishnav College, Chennai)<!slash!strong><!slash!p><p><strong> S.Gayathri,<!slash!strong><!slash!p><p>Ph.D Research Scholar,<!slash!p><p>Sastra Deemed University, Thanjavur<!slash!p><p><strong> Disposition of <em>prameha <!slash!em>in Āyurveda<em> <!slash!em>with special reference to <em>madhumeha<!slash!em> - आयुर्वेदेषु प्रमेह मधुमेहानां स्थानं लक्षणं च<!slash!strong><!slash!p><p><br><!slash!p><p><strong>Aarabhi.R,<!slash!strong><!slash!p><p>Research Scholar,<!slash!p><p>Sree Sankaracharya University of Sanskrit, Kalady<!slash!p><p><strong>Importance of Vājīkaraṇa in human's life<!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>Swathy K.P,<!slash!strong><!slash!p><p>Research Scholar,<!slash!p><p>Sree Sankaracharya University of Sanskrit, Kalady<!slash!p><p><strong>Use of Astras in Kurukṣetra war: An analysis based on Mahābhārata <!slash!strong><!slash!p><p>&nbsp;<!slash!p><p>Arvind V Iyer,<!slash!p><p>Assistant Director of Research,<!slash!p><p>Krishnamacharya Yoga Mandiram<!slash!p><p><strong>Sleep in health and disease in the <em>Aṣṭāṅgahṛdaya<!slash!em>: A thematic survey<!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>&nbsp;C.Srimayur,<!slash!strong><!slash!p><p>Research Scholar,<!slash!p><p>Ramakrishna Mission Vivekananda College, Chennai<!slash!p><p><strong>धनुर्वेदसंहिता<!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>Abhijith Rajendran,<!slash!strong><!slash!p><p>Research Scholar,<!slash!p><p>Sree Sankaracharya University of Sanskrit, Kalady<!slash!p><p><strong>धनुर्वेदोक्तयुद्धोपकरणानां प्रकाराः परिरचय: च <!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>Aswathy Ganesh,<!slash!strong><!slash!p><p>Research Scholar,<!slash!p><p>Sree Sankaracharya University of Sanskrit, Kalady<!slash!p><p><strong>INTEGRATING ECOLOGY AND TRADITION: THE PRINCIPLES OF <em>VṚKṢHĀYURVEDA<!slash!em><!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>Akhila M.D,<!slash!strong><!slash!p><p>Research Scholar,<!slash!p><p>Sree Sankaracharya University of Sanskrit, Kalady<!slash!p><p><strong>Inter-relation of <em>tridoṣa<!slash!em> and&nbsp;Pañcamahābhūta in Āyurveda<!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>Anagha K.P.<!slash!strong><!slash!p><p>Research Scholar,<!slash!p><p>Sree Sankaracharya University of Sanskrit, Kalady<!slash!p><p><strong>आयुर्वेदे दिनचर्या विचारः <!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>Sowmiya R<!slash!strong><!slash!p><p>Asst. Prof.,<!slash!p><p>MOP Vaishnav College for Women, Chennai<!slash!p><p><strong> A Bird's eye view on <em>Dhanurveda<!slash!em> <em>Samhitā<!slash!em> of Maharṣi Vasiṣṭha <!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>Dr.S.Madhurambika,<!slash!strong><!slash!p><p>Asst. Prof.,<!slash!p><p>Ethiraj College for Women, Chennai<!slash!p><p><strong>Khurali<!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>Dr.G.Suresh<!slash!strong><!slash!p><p>Asst. Prof. in Sahitya,<!slash!p><p>The Madras Sanskrit College, Chennai<!slash!p><p><strong> Sāhitya Śastre <em>Āyurvedaviṣayaha<!slash!em><!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>Dr S.Narasimhan<!slash!strong><!slash!p><p>Asst. Prof.,<!slash!p><p>DDGD Vaishnav College, Chennai<!slash!p><p><strong>Āyurveda's guidance for psychological disorders<!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>Praveena P V<!slash!strong><!slash!p><p>Research Scholar,<!slash!p><p>Sree Sankaracharya University of Sanskrit, Kalady<!slash!p><p><strong> The alchemical essence : <em>ratna<!slash!em> and <em>uparatna<!slash!em> in <em>Āyurveda<!slash!em> <em>Prakāśa<!slash!em><!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>&nbsp;Dr.N. Sridhar<!slash!strong><!slash!p><p>Associate Professor,<!slash!p><p>S-VYASA, Deemed to be University<!slash!p><p><strong>Study of <em>Ṛgvidhānam<!slash!em> – A Treatise for Vedic Therapy Based on <em>yajña<!slash!em> &amp; <em>mantra<!slash!em><!slash!strong><!slash!p><p>&nbsp;&nbsp;<!slash!p><p><strong>Ambarish Das<!slash!strong><!slash!p><p>Ph.D Research Scholar,<!slash!p><p>Pondicherry University<!slash!p><p><strong>आयु्र्वेददृष्ट्या आहारशुद्धिकरणम्<!slash!strong><!slash!p><p>&nbsp;<!slash!p><p><strong>Sunita Behera<!slash!strong><!slash!p><p>Research Scholar,<!slash!p><p>Pondicherry University, Department of Sanskrit,Puducherry, Kalapet-605014<!slash!p><p><strong>आयुर्वेददृष्ट्या स्नानस्य महत्वम्<!slash!strong><!slash!p><p><br><!slash!p><p class=\"ql-align-center\">Saturday, 23rd November 2024 - 4.00 p.m.<!slash!p><p class=\"ql-align-center\"><strong>VALEDICTORY FUNCTION<!slash!strong><!slash!p><p class=\"ql-align-center\"><br><!slash!p><p class=\"ql-align-center\"><strong>Dr. J. KRISHNAN<!slash!strong><!slash!p><p class=\"ql-align-center\">(Prof. &amp; Head, Dept. of Sanskrit, Central University, Pondicherry)<!slash!p><p class=\"ql-align-center\">delivers<!slash!p><p class=\"ql-align-center\">the Valedictory Address<!slash!p><p class=\"ql-align-center\">under<!slash!p><p class=\"ql-align-center\">SRI. P. VENKATESA DIKSHITAR, R.V. EASWARAN &amp; SHANKAR VIDYA ENDOWMENTS<!slash!p><p>&nbsp;<!slash!p>",
  //     "photo": "[{\"photo\":\"whatsapp-image-2024-11-25-at-11.54.47-am-(1).jpg\"},{\"photo\":\"whatsapp-image-2024-11-25-at-11.54.47-am-(2).jpg\"},{\"photo\":\"whatsapp-image-2024-11-25-at-11.54.48-am-(1).jpg\"},{\"photo\":\"whatsapp-image-2024-11-25-at-11.54.48-am-(2).jpg\"},{\"photo\":\"whatsapp-image-2024-11-25-at-11.55.11-am-(1).jpg\"},{\"photo\":\"whatsapp-image-2024-11-25-at-11.55.11-am.jpg\"},{\"photo\":\"whatsapp-image-2024-11-25-at-11.55.18-am-(1).jpg\"},{\"photo\":\"whatsapp-image-2024-11-25-at-11.55.19-am.jpg\"},{\"photo\":\"whatsapp-image-2024-11-25-at-11.55.20-am-(1).jpg\"},{\"photo\":\"whatsapp-image-2024-11-25-at-11.55.20-am.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-11.33.15-am.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-11.33.16-am.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.49.13-pm-nUU.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.49.15-pm-E2y.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.49.16-pm-BYx.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.49.21-pm-(1)-gtU.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.49.21-pm-v78.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.49.23-pm-s25.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.49.24-pm-yEk.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.49.29-pm-fR5.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.49.31-pm-9mG.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.49.34-pm-jjM.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.49.39-pm-kr5.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.49.41-pm-2Qz.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.49.46-pm.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.49.50-pm.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.49.59-pm.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.50.01-pm.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.50.04-pm.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.50.07-pm.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.50.17-pm.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.50.21-pm.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.50.26-pm.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.50.29-pm.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.50.38-pm.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.50.40-pm.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.50.44-pm.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.50.48-pm.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.50.50-pm.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.50.52-pm.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.50.54-pm.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.50.55-pm.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.50.56-pm.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.50.57-pm.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.50.58-pm.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.51.00-pm.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.51.02-pm.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.51.03-pm-(1).jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.51.03-pm.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.51.05-pm.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.51.06-pm.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.51.07-pm.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.51.09-pm.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.51.11-pm.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.51.13-pm.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.51.14-pm.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.51.15-pm.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.51.16-pm.jpg\"},{\"photo\":\"whatsapp-image-2024-11-26-at-12.51.17-pm.jpg\"}]",
  //     "category": "Events",
  //     "tag": "Events,News",
  //     "video": "",
  //     "event_name": "National Seminar on Vedāṅgas and Upavedas",
  //     "event_venue": "Sri Chandrasekharendra Saraswati Mandapam, KSRI",
  //     "event_category": "",
  //     "event_date": "2024-11-22",
  //     "event_year": null,
  //     "event_map": "",
  //     "likes": "5",
  //     "user_id": "5",
  //     "status": "draft",
  //     "created_at": "2024-11-26 10:57:07",
  //     "updated_at": "2024-11-26 01:11:24",
  //     "deleted_at": null
  // }

  // to be generated format
  //   {
  //     "title": "NARASIMHACHARI ENDOWMENT - SANSKRIT RECITATION COMPETITION",
  //     "subtitle": "NARASIMHACHARI ENDOWMENT 2024 - SANSKRIT RECITATION COMPETITION",
  //     "description": "\nUnder the Narasimhachari endownment, The Kuppuswami Sastri Research Institute conducted a Sanskrit Sloka recitation Competition  on 25th October 2024. Around 40 students from various city schools actively participated  in the competition and recited 20 shlokas from either SUBRAMHANYA BHUJANGAM or  SAUNDARYA LAHARI.\n",
  //     "category": [
  //         "Events"
  //     ],
  //     "venue": "Sri Chandrasekharendra Saraswati Madapam, The KSRI",
  //     "date": "2024-10-25",
  //     "images": [
  //         {
  //             "src": "upload/whatsapp-image-2024-10-25-at-4.00.17-pm.jpg",
  //             "alt": "NARASIMHACHARI ENDOWMENT 2024 - SANSKRIT RECITATION COMPETITION"
  //         }
  //     ],
  //     "id": "-7873923980693135706"
  // }

  // convert data
  let convertedEvents = [];

  for (const event of events) {
    console.log(event);
    // let event = element;
    let imageUrls = [];

    if (event.photo !== null) {
      const photos = JSON.parse(event.photo);
      console.log(photos);

      for (const photo of photos) {
        imageUrls.push({
          src: `upload/${photo.photo}`,
          alt: event.event_name,
        });
      }
    }

    // if date is not there then add 01-01-2000 to it
    if (event.event_date === null || event.event_date === "") {
      event.event_date = "2000-01-01";
    }
    // for some date only year is available if so add 01-01 to it
    if (event.event_date.length === 4) {
      event.event_date = event.event_date + "-01-01";
    }

    convertedEvents.push({
      title: event.event_name,
      subtitle: event.title,
      description: event.description,
      venue: event.event_venue,
      date: event.event_date,
      images: imageUrls,
      // id: event.id,
      category: [
        // event.category
        // strip out spaces and convert to lowercase
        event.category.trim(),
      ],
    });

    // sort by date
    convertedEvents.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }

  // write data to file
  writeFileSync(
    "./content/events/generated_events.json",
    JSON.stringify(convertedEvents)
  );
};

const downloadImages = async () => {
  const images = [
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-25-at-11.54.47-am-(1).jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-25-at-11.54.47-am-(2).jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-25-at-11.54.48-am-(1).jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-25-at-11.54.48-am-(2).jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-25-at-11.55.11-am-(1).jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-25-at-11.55.11-am.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-25-at-11.55.18-am-(1).jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-25-at-11.55.19-am.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-25-at-11.55.20-am-(1).jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-25-at-11.55.20-am.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-11.33.15-am.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-11.33.16-am.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.49.13-pm-nUU.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.49.15-pm-E2y.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.49.16-pm-BYx.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.49.21-pm-(1)-gtU.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.49.21-pm-v78.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.49.23-pm-s25.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.49.24-pm-yEk.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.49.29-pm-fR5.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.49.31-pm-9mG.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.49.34-pm-jjM.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.49.39-pm-kr5.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.49.41-pm-2Qz.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.49.46-pm.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.49.50-pm.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.49.59-pm.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.50.01-pm.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.50.04-pm.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.50.07-pm.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.50.17-pm.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.50.21-pm.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.50.26-pm.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.50.29-pm.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.50.38-pm.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.50.40-pm.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.50.44-pm.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.50.48-pm.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.50.50-pm.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.50.52-pm.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.50.54-pm.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.50.55-pm.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.50.56-pm.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.50.57-pm.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.50.58-pm.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.51.00-pm.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.51.02-pm.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.51.03-pm-(1).jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.51.03-pm.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.51.05-pm.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.51.06-pm.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.51.07-pm.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.51.09-pm.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.51.11-pm.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.51.13-pm.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.51.14-pm.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.51.15-pm.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.51.16-pm.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
    {
      src: "https://ksri.in/Asset/upload/whatsapp-image-2024-11-26-at-12.51.17-pm.jpg",
      alt: "National Seminar on Vedāṅgas and Upavedas",
    },
  ];
  for (const image of images) {
    const response = await fetch(image.src);
    const blob = await response.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());
    const fileName = image.src.split("/").pop();
    const filePath = `./images/${fileName}`;
    writeFileSync(filePath, buffer);
  }
};
const main = async () => {
  // await insertEndownments();
  // await insertEvents();
  // await insertLibraryArticles();
  // await insertLibraryBooks();
  // await insertLibraryJournals();
  // await insertOutOfStockPubBooks("outofstock", "No");
  // await insertOutOfStockPubBooks("forsale", "Yes");
  // await insertsamskritaacademypublicationsBooks();
  // await insertPublicationBooks();
  // await insertPublicationCommittee();
  // await insertPublicationJournals();
  // await insertAllPublicationBooks();
  // await insertForeignScholars();
  // await insertshastrachudamanis();
  // await insertvidyavaridhis();
  // await insertTraditionalScholars();
  // await insertStudents();
  // await insertfaculty();
  // await insertGallery();
  // await insertmilestones();
  // await insertNews();
  // await insertProjects();
  // await insertResearchArticles();
  // await insertpresentGoverningBodyMembers();
  // await insertGoveringBodyPast();
  // await eventsFromAdminApp(); // not requried to deploy to DDB
  // await downloadImages();
};

main();
