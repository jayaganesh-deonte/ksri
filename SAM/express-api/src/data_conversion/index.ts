import { ulid } from "ulidx";

import { batchInsert } from "./ddb";

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
import { title } from "process";

const insertEndownments = async () => {
  // load content/contribute/endownments.json file into endownments variable
  const endownments = require("./content/contribute/endownments.json");
  console.log(endownments);

  // import endowment model

  // add id to endownments
  const endownmentsWithId = endownments.map((endowment: any) => ({
    ...endowment,
    id: ulid(),
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
  const events = require("./content/events/events.json");
  // add id to events
  const eventsWithId = events.map((event: any) => ({
    ...event,
    id: ulid(),
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
  const articles = require("./content/library/articles.json");
  // add id to articles
  const articlesWithId = articles.map((article: any) => ({
    ...article,
    id: ulid(),
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
  console.log(articlesDynamoDB);
  // insert articles into dynamoDB
  await batchInsert(articlesDynamoDB);
};

const insertLibraryBooks = async () => {
  // load books
  const books = require("./content/library/books.json");

  const booksWithId = books.map((book: any) => ({
    ...book,
    id: ulid(),
    metadata: generateMetaData(),
  }));

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
  booksDynamoDB.forEach((book) => {
    if (!isBookDDB(book)) {
      console.log("Invalid book", book);
      return console.log("Invalid book", book);
    }
  });
  await batchInsert(booksDynamoDB);
};

const insertLibraryJournals = async () => {
  // load journals
  const journals = require("./content/library/journals.json");
  // add id to journals
  const journalsWithId = journals.map((journal: any) => ({
    ...journal,
    id: ulid(),
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
    metadata: generateMetaData(),
    available: "true",
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

  const presentStudentsWithId = allStudents.map((student: any) => ({
    ...student,
    id: ulid(),
    metadata: generateMetaData(),
    status: "On-Going",
  }));

  allStudents = allStudents.concat(presentStudentsWithId);

  // load past/mphil students
  const pastMphilStudents: Student[] = require("./content/students/past/mphil.json");

  const pastMphilStudentsWithId = pastMphilStudents.map((student: any) => ({
    ...student,
    id: ulid(),
    metadata: generateMetaData(),
    status: "Completed",
  }));
  allStudents = allStudents.concat(pastMphilStudentsWithId);

  // load past/phd students
  const pastPhdStudents: Student[] = require("./content/students/past/phd.json");

  const pastPhdStudentsWithId = pastPhdStudents.map((student: any) => ({
    ...student,
    id: ulid(),
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
  //             "imageUrl": "https://d30y75l38k1y9.cloudfront.net/upload/1.jpg",
  //             "description": "Inaugration of the KSRInstitute by S.V.Ramamurthi I.C.S. on 22nd April 1945. L.to R.: K.M.Munshi, Sir.S.V.Ramamurthi, Rt.Hon'ble V.S. Srinivasa Sastri & Dr. S. Radhakrishnan"
  //         },
  //         "Memories of KSRI": [
  //             {
  //                 "imageUrl": "https://d30y75l38k1y9.cloudfront.net/upload/1.jpg",
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
  const newsWithId = news.map((news: any) => ({
    ...news,
    id: ulid(),
    metadata: generateMetaData(),
    avatarImage: [news.avatarImage],
    heading_image_url: [news.heading_image_url],
  }));

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
      id: ulid(),
      metadata: generateMetaData(),
    }));

    const membersWithDesignationDDB = membersWithDesignation.map(
      (member: any) => governingBodyMembersToDynamoDB(member)
    );

    // console.log(membersWithDesignationDDB);
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
        metadata: generateMetaData(),
        available: "true",
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
      metadata: generateMetaData(),
      available: available,
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

const main = async () => {
  // await insertEndownments();
  // await insertEvents();
  // await insertLibraryArticles();
  // await insertLibraryBooks();
  // await insertLibraryJournals();
  await insertPublicationBooks();

  await insertsamskritaacademypublicationsBooks();

  await insertOutOfStockPubBooks("outofstock", false);
  await insertOutOfStockPubBooks("forsale", true);

  // await insertPublicationCommittee();
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
};

main();
