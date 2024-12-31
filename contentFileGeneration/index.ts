import { writeFileSync, existsSync, mkdirSync } from "fs";
import axios from "axios";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001";

// Function to fetch data from API and save to file
async function fetchAndSaveData(
  endpoint: string,
  outputFile: string,
  filter?: Function
): Promise<any> {
  try {
    // Make API request
    const response = await axios.get(`${API_BASE_URL}${endpoint}`);

    let data = response.data;

    // apply filter if provided
    if (filter && Array.isArray(data)) {
      data = filter(data);
    }

    // Convert response data to JSON string
    let jsonData = JSON.stringify(data, null, 2);

    // Write data to file
    // if output folder doesn't exist, create it
    const outputFolder = outputFile.split("/").slice(0, -1).join("/");
    if (!existsSync(outputFolder)) {
      mkdirSync(outputFolder, { recursive: true });
    }
    writeFileSync(outputFile, jsonData);

    console.log(`Data successfully saved to ${outputFile}`);
    return data;
  } catch (error) {
    console.error("Error fetching or saving data:", error);
    throw error;
  }
}

const pageDetails = [
  {
    endpoint: "/contribute/bankInfo",
    outputFile: "../website/content//contribute/bankInfo.json",
  },
  {
    endpoint: "/contribute/postalAddress",
    outputFile: "../website/content//contribute/bypost.json",
  },
  // endownments
  {
    endpoint: "/contribute/endownments",
    outputFile: "../website/content//contribute/endownments.json",
  },
  // events
  {
    endpoint: "/events",
    outputFile: "../website/content//events/events.json",
    //  sort by date which is in yyyy-mm-dd format
    filter: (data: any[]) =>
      data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
  },
  // /gallery/collections
  {
    endpoint: "/gallery/collections",
    outputFile: "../website/content//gallery/collections.json",
    // only name
    filter: (data: any[]) => data.map((item) => item.name),
  },
  // /gallery
  {
    endpoint: "/gallery",
    outputFile: "../website/content//gallery/gallery.json",
  },
  // governing-body-members present
  {
    endpoint: "/governing-body-members",
    outputFile: "../website/content//governingbodymembers/present.json",
  },
  // governing-body-members-past
  {
    endpoint: "/governing-body-members-past",
    outputFile: "../website/content//governingbodymembers/past.json",
  },
  // /library/articles
  {
    endpoint: "/library/articles",
    outputFile: "../website/content//library/articles.json",
  },
  //  /library/books
  {
    endpoint: "/library/books",
    outputFile: "../website/content//library/books.json",
  },
  // /library/journals
  {
    endpoint: "/library/journals",
    outputFile: "../website/content//library/journals.json",
  },
  // // /publications/additionalPublications
  // {
  //   endpoint: "/publications/additionalPublications",
  //   outputFile: "../website/content//publications/additionalpublications.json",
  //   // sort based on orderId and select only name and store it in additionalPublications
  //   filter: (data: any[]) => {
  //     additionalPublications = data
  //       .sort((a, b) => a.orderId - b.orderId)
  //       .map((item) => item.name);
  //     return additionalPublications;
  //   },
  //   // filter: (data: any[]) =>
  //   //   data.sort((a, b) => a.orderId - b.orderId).map((item) => item.name),
  // },
  // // /publications/books?publication-KSRI
  // {
  //   endpoint: "/publications/books?publication=KSRI",
  //   outputFile: "../website/content//publications/books.json",
  // },
  // {
  //   endpoint: "/publications/books?publication=Samskrita Academy",
  //   outputFile:
  //     "../website/content//publications/samskritaacademypublications.json",
  // },
  // publications/committee-members
  {
    endpoint: "/publications/committee-members",
    outputFile: "../website/content//publications/committeemembers.json",
  },
  // /foreign-scholars
  {
    endpoint: "/foreign-scholars",
    outputFile: "../website/content//scholars_gateway/foreignscholars.json",
  },
  // /traditional-scholars
  {
    endpoint: "/traditional-scholars",
    outputFile: "../website/content//scholars_gateway/traditionalscholars.json",
    filter: (data: any[]) =>
      data.filter((item) => item.type === "Traditional Study"),
  },
  //  shastrachudamanis
  {
    endpoint: "/traditional-scholars",
    outputFile: "../website/content//scholars_gateway/shastrachudamanis.json",
    filter: (data: any[]) =>
      data.filter((item) => item.type === "Shastrachudamani"),
  },
  // vidyavaridhis
  {
    endpoint: "/traditional-scholars",
    outputFile: "../website/content//scholars_gateway/vidyavaridhis.json",
    filter: (data: any[]) =>
      data.filter((item) => item.type === "Vidyavaridhi"),
  },

  // students/past/mphil
  {
    endpoint: "/students?status=Completed&course=M.Phil",
    outputFile: "../website/content//students/past/mphil.json",
  },
  // students/past/phd
  {
    endpoint: "/students?status=Completed&course=Ph.D.",
    outputFile: "../website/content//students/past/phd.json",
  },
  // students/present
  {
    endpoint: "/students?status=On-Going",
    outputFile: "../website/content//students/present/students.json",
  },
  // faculty
  {
    endpoint: "/faculty?designationType=ACADEMIC",
    outputFile: "../website/content//faculty/faculty.json",
  },
  // /faculty/designation
  {
    endpoint: "/faculty/designation?designationType=ACADEMIC",
    outputFile: "../website/content//faculty/designation.json",
    //  order by orderId and select only name
    filter: (data: any[]) =>
      data.sort((a, b) => a.orderId - b.orderId).map((item) => item.name),
  },

  // faculty NON ACADEMIC
  {
    endpoint: "/faculty?designationType=NON ACADEMIC",
    outputFile: "../website/content//faculty/nonacademic.json",
  },
  // /faculty/designation
  {
    endpoint: "/faculty/designation?designationType=NON ACADEMIC",
    outputFile: "../website/content//faculty/nonacademicdesignation.json",
    //  order by orderId and select only name
    filter: (data: any[]) =>
      data.sort((a, b) => a.orderId - b.orderId).map((item) => item.name),
  },

  // milestones
  {
    endpoint: "/milestones",
    outputFile: "../website/content//milestones.json",
    // sort by year in descending order
    filter: (data: any[]) => data.sort((a, b) => b.year - a.year),
  },
  // news
  {
    endpoint: "/news",
    outputFile: "../website/content//news.json",
    // sort by id in  ascending order
    filter: (data: any[]) => data.sort((a, b) => a.id - b.id),
  },
  // /project/series
  {
    endpoint: "/project/series",
    outputFile: "../website/content//projects/series.json",
    // order by orderid and get only name
    filter: (data: any[]) =>
      data.sort((a, b) => a.orderId - b.orderId).map((item) => item.name),
  },
  //  project sub series mapping
  {
    endpoint: "/project/series",
    outputFile: "../website/content//projects/subseries.json",
    // get only name and subseries names
    filter: (data: any[]) =>
      data
        .sort((a, b) => a.orderId - b.orderId)
        .map((item) => ({
          name: item.name,
          subSeries: item.subSeries.map((subItem) => subItem.name),
          description: item.description,
        })),
  },
  ///projects?status=Future Projects
  {
    endpoint: "/projects?status=Future Projects",
    outputFile: "../website/content//projects/futureprojects.json",
    // sort by "startYear": "2005"
    filter: (data: any[]) => data.sort((b, a) => a.startYear - b.startYear),
  },
  ///projects?status=On-Going
  {
    endpoint: "/projects?status=On-Going",
    outputFile: "../website/content//projects/ongoingprojects.json",
    // sort by "startYear": "2005"
    filter: (data: any[]) => data.sort((b, a) => a.startYear - b.startYear),
  },
  ///projects?status=Completed
  {
    endpoint: "/projects?status=Completed",
    outputFile: "../website/content//projects/completedprojects.json",
    // sort by "completedYear": "2005-08"
    // filter: (data: any[]) =>
    //   data.sort((a, b) => a.completedYear - b.completedYear),
    //  sort by descending order
    filter: (data: any[]) =>
      data.sort((a, b) => b.completedYear - a.completedYear),
  },
  // researchArticles
  {
    endpoint: "/researchArticles",
    outputFile: "../website/content//researcharticles.json",
  },
  // supervisor
  {
    endpoint: "/supervisor",
    outputFile: "../website/content//supervisor.json",
    //  from array of object, pick only name
    filter: (data: any[]) => data.map((item) => item.name),
  },
  // chair
  {
    endpoint: "/chair",
    outputFile: "../website/content//chair.json",
    //  order based on orderId
    filter: (data: any[]) => data.sort((a, b) => a.orderId - b.orderId),
  },
];

const fixedData = [
  {
    fileContent: [
      {
        name: "M.Phil",
        subTitle: "(Affiliated to the University of Madras)",
      },
      {
        name: "Ph.D.",
        subTitle: "(Affiliated to the University of Madras)",
      },
    ],
    outputFile: "../website/content//courses.json",
  },
  {
    fileContent: [
      {
        Science: [
          "1 Mathematics*",
          "2 Arithmetic",
          "3 Astronomy",
          "4 Algebra",
          "5 Geometry",
          "6 Trigonometry",
          "7 Astrology",
          "8 Physics",
          "9 Chemistry",
          "10 Zoology",
          "11 Ornithology",
          "12 Botany*",
          "13 Flowers and Fruits",
          "14 Medicine",
          "15 Surgical Instruments*",
          "16 Embryology/Genetics",
          "17 Pediatrics",
          "18 Physiology/Anatomy",
          "19 Psychology",
          "20 Alchemy",
          "21 Metallurgy",
          "22 Mechanical Contrivances",
          "23 Gemmology",
          "24 Environmental Studies",
          "25 Water Divining",
          "26 War Science",
          "27 Geography",
          "28 Geology",
          "29 Oceanography*",
          "30 Medicinal Plants",
          "31 Agriculture",
          "32 Horticulture",
          "33 Cartography",
          "34 Dietetics",
          "35 Planets and Stars*",
        ],
        "Art and Architecture": [
          "1 Dance",
          "2 Music*",
          "3 Architecture",
          "4 Vastu",
          "5 Iconography",
          "6 Temple Architecture",
          "7 Town Planning*",
          "8 Sculpture",
          "9 Painting/colouring/dyeing",
          "10 Sports and Games",
          "11 Boxing and Wrestling",
          "12 Aeronautics",
          "13 Ship Building",
          "14 Culinary",
        ],
        "Social Studies": [
          "1 Women Studies",
          "2 Life of Brahmacharins",
          "3 Life of Grihasthas",
          "4 Life of Vanaprasthas",
          "5 Life of Sannyasins",
          "6 Law of Inheritance",
          "7 Management Studies",
          "8 Education",
          "9 Law and Jurisprudence",
          "10 Transportation",
          "11 Communication",
          "12 Water Management",
          "13 Rivers",
          "14 Trade and Commerce",
          "15 Taxation",
          "16 Irrigation",
          "17 Costumes and Jewellery",
          "18 Economics",
          "19 Politics",
          "20 Rituals and Sacrifices",
          "21 Festivals*",
          "22 Gods and goddesses",
          "23 Labourers and Craftsmen",
          "24 Sanskrit Institutions in India",
        ],
        Literature: [
          "1 Vedic Literature*",
          "2 Minor Upanishads",
          "3 Epics*",
          "4 Puranas",
          "5 Smrti/Dharmasastra",
          "6 Kavya (Poetry)",
          "7 Prose",
          "8 Campu",
          "9 Drama",
          "10 Alankara",
          "11 Lexicography",
          "12 Grammar*",
          "13 Riddles/Brain Teasers*",
          "14 Modern Literature",
          "15 Darsana (Philosophy)",
          "16 Nastika ( Heterodox) Schools",
          "17 Mimamsa",
          "18 Nyaya-Vaisesika",
          "19 Sankhya-Yoga",
          "20 Vedanta",
          "21 Buddhism",
          "22 Jainism",
          "23 Agama (Saiva, Sakta and Vaishnava)",
          "24 Stotra Literature",
          "25 Bhakti Literature",
          "26 Manuscriptology",
          "27 Epigraphy",
        ],
      },
    ],
    outputFile:
      "../website/content//projects/ancientindianknowledgeseries.json",
  },
  {
    fileContent: [
      "Upcoming",
      "Seminars",
      "Endowment Lectures",
      "Workshop",
      "Viva",
      "Events",
      "All",
    ],
    outputFile: "../website/content//events/categories.json",
  },
];

const saveFixedData = async (fileContent: any, outputFile: string) => {
  try {
    let jsonData = JSON.stringify(fileContent, null, 2);
    // Write data to file
    // if output folder doesn't exist, create it
    const outputFolder = outputFile.split("/").slice(0, -1).join("/");
    if (!existsSync(outputFolder)) {
      mkdirSync(outputFolder, { recursive: true });
    }
    writeFileSync(outputFile, jsonData);

    console.log(`Data successfully saved to ${outputFile}`);
  } catch (error) {
    console.error("Error fetching or saving data:", error);
    throw error;
  }
};

const fetchPublicationsAndBooks = async () => {
  //  // /publications/additionalPublications
  //  {
  //   endpoint: "/publications/additionalPublications",
  //   outputFile: "../website/content//publications/additionalpublications.json",
  //   // sort based on orderId and select only name and store it in additionalPublications
  //   filter: (data: any[]) => {
  //     additionalPublications = data
  //       .sort((a, b) => a.orderId - b.orderId)
  //       .map((item) => item.name);
  //     return additionalPublications;
  //   },
  //   // filter: (data: any[]) =>
  //   //   data.sort((a, b) => a.orderId - b.orderId).map((item) => item.name),
  // },
  // // /publications/books?publication-KSRI
  // {
  //   endpoint: "/publications/books?publication=KSRI",
  //   outputFile: "../website/content//publications/books.json",
  // },
  // {
  //   endpoint: "/publications/books?publication=Samskrita Academy",
  //   outputFile:
  //     "../website/content//publications/samskritaacademypublications.json",
  // },

  // fetch additionalPublications
  const additionalPublications = await fetchAndSaveData(
    "/publications/additionalPublications",
    "../website/content//publications/additionalpublications.json",
    (data: any[]) => {
      return data
        .sort((a, b) => a.orderId - b.orderId)
        .map((item) => item.name);
    }
  );

  // store additionalPublications to json file
  const additionalPublicationsJson = JSON.stringify(additionalPublications);
  writeFileSync(
    "../website/content//publications/additionalpublications.json",
    additionalPublicationsJson
  );

  //  fetch books based on additionalPublications
  const books = await fetchAndSaveData(
    "/publications/books?publication=KSRI",
    "../website/content//publications/books.json",
    (data: any[]) => {
      return data.sort((a, b) => b.yearOfPublication - a.yearOfPublication);
    }
  );

  //  for each additionalPublication, fetch books
  for (const publication of additionalPublications) {
    // remove spaces
    const publicationNameForFile = publication.replace(/ /g, "_").toLowerCase();
    const books = await fetchAndSaveData(
      `/publications/books?publication=${publication}`,
      `../website/content//publications/${publicationNameForFile}.json`
    );
    (data: any[]) => {
      return data.sort((a, b) => b.yearOfPublication - a.yearOfPublication);
    };
  }

  //  fetch journals
  const journals = await fetchAndSaveData(
    "/publications/journals?publication=KSRI",
    "../website/content//publications/journals.json",
    (data: any[]) => {
      return data.sort((a, b) => b.yearOfPublication - a.yearOfPublication);
    }
  );

  //  fetch journals based on additionalPublications
  for (const publication of additionalPublications) {
    // remove spaces
    const publicationNameForFile = publication.replace(/ /g, "_").toLowerCase();
    const journals = await fetchAndSaveData(
      `/publications/journals?publication=${publication}`,
      `../website/content//publications/${publicationNameForFile}journals.json`,
      (data: any[]) => {
        return data.sort((a, b) => b.yearOfPublication - a.yearOfPublication);
      }
    );
  }
};

const main = async () => {
  for (const { endpoint, outputFile, filter } of pageDetails) {
    await fetchAndSaveData(endpoint, outputFile, filter);
  }

  for (const { fileContent, outputFile } of fixedData) {
    await saveFixedData(fileContent, outputFile);
  }

  await fetchPublicationsAndBooks();
};

main();
