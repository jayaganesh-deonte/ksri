"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var axios_1 = require("axios");
var API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001";
// Function to fetch data from API and save to file
function fetchAndSaveData(endpoint_1, outputFile_1, filter_1) {
    return __awaiter(this, arguments, void 0, function (endpoint, outputFile, filter, fetchItemsWithPagination) {
        var data, lastEvaluatedKey, url, response, response, jsonData, outputFolder, error_1;
        if (fetchItemsWithPagination === void 0) { fetchItemsWithPagination = false; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    data = [];
                    lastEvaluatedKey = null;
                    if (!fetchItemsWithPagination) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    url = lastEvaluatedKey
                        ? "".concat(API_BASE_URL).concat(endpoint, "?limit=10000&lastEvaluatedKey=").concat(lastEvaluatedKey)
                        : "".concat(API_BASE_URL).concat(endpoint);
                    return [4 /*yield*/, axios_1.default.get(url)];
                case 2:
                    response = _a.sent();
                    data = data.concat(response.data.data || response.data);
                    lastEvaluatedKey = response.data.lastEvaluatedKey;
                    _a.label = 3;
                case 3:
                    if (fetchItemsWithPagination && lastEvaluatedKey) return [3 /*break*/, 1];
                    _a.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, axios_1.default.get("".concat(API_BASE_URL).concat(endpoint))];
                case 6:
                    response = _a.sent();
                    data = response.data;
                    _a.label = 7;
                case 7:
                    // apply filter if provided
                    if (filter && Array.isArray(data)) {
                        data = filter(data);
                    }
                    jsonData = JSON.stringify(data, null, 2);
                    outputFolder = outputFile.split("/").slice(0, -1).join("/");
                    if (!(0, fs_1.existsSync)(outputFolder)) {
                        (0, fs_1.mkdirSync)(outputFolder, { recursive: true });
                    }
                    (0, fs_1.writeFileSync)(outputFile, jsonData);
                    console.log("Data successfully saved to ".concat(outputFile));
                    return [2 /*return*/, data];
                case 8:
                    error_1 = _a.sent();
                    console.error("Error fetching or saving data:", error_1);
                    throw error_1;
                case 9: return [2 /*return*/];
            }
        });
    });
}
var pageDetails = [
    {
        endpoint: "/contribute/bankInfo",
        outputFile: "../website/content//contribute/bankInfo.json",
        // filter by itemPublishStatus =>"PUBLISHED"
        filter: function (data) {
            return data.filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; });
        },
    },
    {
        endpoint: "/contribute/postalAddress",
        outputFile: "../website/content//contribute/bypost.json",
        // filter by itemPublishStatus =>"PUBLISHED"
    },
    // endownments
    {
        endpoint: "/contribute/endownments",
        outputFile: "../website/content//contribute/endownments.json",
        // filter by itemPublishStatus =>"PUBLISHED"
    },
    // events
    {
        endpoint: "/events",
        outputFile: "../website/content//events/events.json",
        //  sort by date which is in yyyy-mm-dd format
        // filter by itemPublishStatus =>"PUBLISHED"
        filter: function (data) {
            return data
                .filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; })
                .sort(function (a, b) { return new Date(b.date).getTime() - new Date(a.date).getTime(); });
        },
    },
    // /gallery/collections
    {
        endpoint: "/gallery/collections",
        outputFile: "../website/content//gallery/collections.json",
        // filter by itemPublishStatus =>"PUBLISHED" and select only name
        filter: function (data) {
            return data
                .filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; })
                .sort(function (b, a) { return a.id - b.id; })
                .map(function (item) { return item.name; });
        },
    },
    // /gallery
    {
        endpoint: "/gallery",
        outputFile: "../website/content//gallery/gallery.json",
        // filter by itemPublishStatus =>"PUBLISHED"
        filter: function (data) {
            return data.filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; });
        },
    },
    // governing-body-members present
    {
        endpoint: "/governing-body-members",
        outputFile: "../website/content//governingbodymembers/present.json",
        // filter by itemPublishStatus =>"PUBLISHED"
        filter: function (data) {
            return data
                .filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; })
                // filter by designationStatus => "Present"
                .filter(function (item) { return item.designationStatus === "Present"; });
        },
    },
    // governing-body-members-past
    {
        endpoint: "/governing-body-members",
        outputFile: "../website/content//governingbodymembers/past.json",
        // filter by itemPublishStatus =>"PUBLISHED"
        filter: function (data) {
            return data
                .filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; })
                // filter by designationStatus => "Past"
                .filter(function (item) { return item.designationStatus === "Past"; });
        },
    },
    // /library/articles
    {
        endpoint: "/library/articles",
        outputFile: "../website/content//library/articles.json",
        fetchItemsWithPagination: true,
        // filter by itemPublishStatus =>"PUBLISHED"
        filter: function (data) {
            return data.filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; });
        },
    },
    //  /library/books
    {
        endpoint: "/library/books",
        outputFile: "../website/content//library/books.json",
        fetchItemsWithPagination: true,
        // sort by accessionNo & filter by itemPublishStatus =>"PUBLISHED"
        filter: function (data) {
            return data
                .filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; })
                .sort(function (a, b) { return a.accessionNo - b.accessionNo; });
        },
    },
    // /library/journals
    {
        endpoint: "/library/journals",
        outputFile: "../website/content//library/journals.json",
        fetchItemsWithPagination: true,
        // sort by JournalAccNo & filter by itemPublishStatus =>"PUBLISHED"
        filter: function (data) {
            return data
                .filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; })
                .sort(function (a, b) { return a.JournalAccNo - b.JournalAccNo; });
        },
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
        // filter by itemPublishStatus =>"PUBLISHED"
        filter: function (data) {
            return data.filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; });
        },
    },
    //  "/advisory-board"
    {
        endpoint: "/advisory-board",
        outputFile: "../website/content//advisoryboard.json",
        // filter by itemPublishStatus =>"PUBLISHED"
        filter: function (data) {
            return data
                .filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; })
                .sort(function (a, b) { return a.orderId - b.orderId; });
        },
    },
    // /foreign-scholars
    {
        endpoint: "/foreign-scholars",
        outputFile: "../website/content//scholars_gateway/foreignscholars.json",
        // filter by itemPublishStatus =>"PUBLISHED"
        filter: function (data) {
            return data.filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; });
        },
    },
    // /traditional-scholars
    {
        endpoint: "/traditional-scholars",
        outputFile: "../website/content//scholars_gateway/traditionalscholars.json",
        // filter by itemPublishStatus =>"PUBLISHED"
        filter: function (data) {
            return data
                .filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; })
                .filter(function (item) { return item.type === "Traditional Study"; });
        },
    },
    //  shastrachudamanis
    {
        endpoint: "/traditional-scholars",
        outputFile: "../website/content//scholars_gateway/shastrachudamanis.json",
        // filter by itemPublishStatus =>"PUBLISHED"
        filter: function (data) {
            return data
                .filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; })
                .filter(function (item) { return item.type === "Shastrachudamani"; });
        },
    },
    // vidyavaridhis
    {
        endpoint: "/traditional-scholars",
        outputFile: "../website/content//scholars_gateway/vidyavaridhis.json",
        // filter by itemPublishStatus =>"PUBLISHED"
        filter: function (data) {
            return data
                .filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; })
                .filter(function (item) { return item.type === "Vidyavaridhi"; });
        },
    },
    // students/past/mphil
    {
        endpoint: "/students?status=Completed&course=M.Phil.",
        outputFile: "../website/content//students/past/mphil.json",
        // startedYear: item.startedYear,
        // completedYear: item.completedYear,
        // sort by  startedYear and completedYear if completedYear is null then sort by startedYear
        filter: function (data) {
            return data
                .filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; })
                .sort(function (a, b) {
                if (a.completedYear === null) {
                    return a.startedYear - b.startedYear;
                }
                if (b.completedYear === null) {
                    return a.startedYear - b.startedYear;
                }
                return a.completedYear - b.completedYear;
            });
        },
    },
    // students/past/phd
    {
        endpoint: "/students?status=Completed&course=Ph.D.",
        outputFile: "../website/content//students/past/phd.json",
        filter: function (data) {
            return data
                .filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; })
                .sort(function (a, b) {
                if (a.completedYear === null) {
                    return a.startedYear - b.startedYear;
                }
                if (b.completedYear === null) {
                    return a.startedYear - b.startedYear;
                }
                return a.completedYear - b.completedYear;
            });
        },
    },
    // students/present
    {
        endpoint: "/students?status=On-Going",
        outputFile: "../website/content//students/present/students.json",
        filter: function (data) {
            return data
                .filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; })
                .sort(function (a, b) {
                if (a.completedYear === null) {
                    return a.startedYear - b.startedYear;
                }
                if (b.completedYear === null) {
                    return a.startedYear - b.startedYear;
                }
                return a.completedYear - b.completedYear;
            });
        },
    },
    // faculty
    {
        endpoint: "/faculty?designationType=ACADEMIC",
        outputFile: "../website/content//faculty/faculty.json",
        // filter by itemPublishStatus =>"PUBLISHED"
        filter: function (data) {
            return data.filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; });
        },
    },
    // /faculty/designation
    {
        endpoint: "/faculty/designation?designationType=ACADEMIC",
        outputFile: "../website/content//faculty/designation.json",
        //  order by orderId and select only name
        filter: function (data) {
            return data
                .filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; })
                .sort(function (a, b) { return a.orderId - b.orderId; })
                .map(function (item) { return item.name; });
        },
    },
    // faculty NON ACADEMIC
    {
        endpoint: "/faculty?designationType=NON ACADEMIC",
        outputFile: "../website/content//faculty/nonacademic.json",
        // filter by itemPublishStatus =>"PUBLISHED"
        filter: function (data) {
            return data.filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; });
        },
    },
    // /faculty/designation
    {
        endpoint: "/faculty/designation?designationType=NON ACADEMIC",
        outputFile: "../website/content//faculty/nonacademicdesignation.json",
        //  order by orderId and select only name
        filter: function (data) {
            return data
                .filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; })
                .sort(function (a, b) { return a.orderId - b.orderId; })
                .map(function (item) { return item.name; });
        },
    },
    // milestones
    {
        endpoint: "/milestones",
        outputFile: "../website/content//milestones.json",
        // sort by year in descending order
        filter: function (data) {
            return data
                .filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; })
                .sort(function (a, b) { return b.year - a.year; });
        },
    },
    // news
    {
        endpoint: "/news",
        outputFile: "../website/content//news.json",
        // sort by id in  ascending order
        filter: function (data) {
            return data
                .filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; })
                .sort(function (a, b) { return a.id - b.id; });
        },
    },
    // /project/series
    {
        endpoint: "/project/series",
        outputFile: "../website/content//projects/series.json",
        // order by orderid and get only name
        filter: function (data) {
            return data
                .filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; })
                .sort(function (a, b) { return a.orderId - b.orderId; })
                .map(function (item) { return item.name; });
        },
    },
    //  project sub series mapping
    {
        endpoint: "/project/series",
        outputFile: "../website/content//projects/subseries.json",
        // get only name and subseries names
        filter: function (data) {
            return data
                .filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; })
                .sort(function (a, b) { return a.orderId - b.orderId; })
                .map(function (item) { return ({
                name: item.name,
                subSeries: item.subSeries.map(function (subItem) { return subItem.name; }),
                description: item.description,
            }); });
        },
    },
    ///projects?status=Future Projects
    {
        endpoint: "/projects?status=Future Projects",
        outputFile: "../website/content//projects/futureprojects.json",
        // sort by "startYear": "2005"
        filter: function (data) {
            return data
                .filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; })
                .sort(function (b, a) { return a.startYear - b.startYear; });
        },
    },
    // /projects?status=On-Going
    {
        endpoint: "/projects?status=On-Going",
        outputFile: "../website/content//projects/ongoingprojects.json",
        // sort by "startYear": "2005"
        filter: function (data) {
            return data
                .filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; })
                .sort(function (b, a) { return a.startYear - b.startYear; });
        },
    },
    ///projects?status=Completed
    {
        endpoint: "/projects?status=Completed",
        outputFile: "../website/content//projects/completedprojects.json",
        // sort by "completedYear": "2005-08"
        // filter: (data: any[]) =>
        //   data.sort((a, b) => a.completedYear - b.completedYear),
        //  sort by descending order
        filter: function (data) {
            return data
                .filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; })
                .sort(function (a, b) { return b.completedYear - a.completedYear; });
        },
    },
    // researchArticles
    {
        endpoint: "/researchArticles",
        outputFile: "../website/content//researcharticles.json",
        // filter by itemPublishStatus =>"PUBLISHED"
        filter: function (data) {
            return data.filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; });
        },
    },
    // supervisor
    {
        endpoint: "/supervisor",
        outputFile: "../website/content//supervisor.json",
        //  from array of object, pick only name
        filter: function (data) {
            return data
                .filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; })
                .sort(function (a, b) { return a.orderId - b.orderId; })
                .map(function (item) { return item.name; });
        },
    },
    // supervisor details
    {
        endpoint: "/supervisor",
        outputFile: "../website/content//supervisordetails.json",
        //  from array of object, pick only name
        filter: function (data) {
            return data
                .filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; })
                .sort(function (a, b) { return a.orderId - b.orderId; });
        },
    },
    // chair
    {
        endpoint: "/chair",
        outputFile: "../website/content//chair.json",
        //  order based on orderId
        filter: function (data) {
            return data
                .filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; })
                .sort(function (a, b) { return a.orderId - b.orderId; });
        },
    },
];
var fixedData = [
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
        outputFile: "../website/content//projects/ancientindianknowledgeseries.json",
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
var saveFixedData = function (fileContent, outputFile) { return __awaiter(void 0, void 0, void 0, function () {
    var jsonData, outputFolder;
    return __generator(this, function (_a) {
        try {
            jsonData = JSON.stringify(fileContent, null, 2);
            outputFolder = outputFile.split("/").slice(0, -1).join("/");
            if (!(0, fs_1.existsSync)(outputFolder)) {
                (0, fs_1.mkdirSync)(outputFolder, { recursive: true });
            }
            (0, fs_1.writeFileSync)(outputFile, jsonData);
            console.log("Data successfully saved to ".concat(outputFile));
        }
        catch (error) {
            console.error("Error fetching or saving data:", error);
            throw error;
        }
        return [2 /*return*/];
    });
}); };
var fetchPublicationsAndBooks = function () { return __awaiter(void 0, void 0, void 0, function () {
    var additionalPublications, additionalPublicationsJson, books, _i, additionalPublications_1, publication, publicationNameForFile, books_1, journals, _a, additionalPublications_2, publication, publicationNameForFile, journals_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, fetchAndSaveData("/publications/additionalPublications", "../website/content//publications/additionalpublications.json", function (data) {
                    return data
                        .filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; })
                        .sort(function (a, b) { return a.orderId - b.orderId; })
                        .map(function (item) { return item.name; });
                })];
            case 1:
                additionalPublications = _b.sent();
                additionalPublicationsJson = JSON.stringify(additionalPublications);
                (0, fs_1.writeFileSync)("../website/content//publications/additionalpublications.json", additionalPublicationsJson);
                return [4 /*yield*/, fetchAndSaveData("/publications/books?publication=KSRI", "../website/content//publications/books.json", function (data) {
                        return (data
                            .filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; })
                            // yearOfPublication is 'YYYY-MM-DD' format and sometimes it is not available
                            .sort(function (a, b) {
                            // Handle empty or missing yearOfPublication
                            if (!a.yearOfPublication)
                                return 1;
                            if (!b.yearOfPublication)
                                return -1;
                            // Compare dates using Date object comparison
                            var dateA = new Date(a.yearOfPublication);
                            var dateB = new Date(b.yearOfPublication);
                            // Compare timestamps to sort from newest to oldest
                            return dateB.getTime() - dateA.getTime();
                        }));
                    })];
            case 2:
                books = _b.sent();
                _i = 0, additionalPublications_1 = additionalPublications;
                _b.label = 3;
            case 3:
                if (!(_i < additionalPublications_1.length)) return [3 /*break*/, 6];
                publication = additionalPublications_1[_i];
                publicationNameForFile = publication
                    .replace(/[^a-zA-Z0-9]/g, "")
                    .toLowerCase();
                return [4 /*yield*/, fetchAndSaveData("/publications/books?publication=".concat(publication), "../website/content//publications/".concat(publicationNameForFile, ".json"))];
            case 4:
                books_1 = _b.sent();
                (function (data) {
                    return (data
                        .filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; })
                        // .sort((a, b) => b.yearOfPublication - a.yearOfPublication);
                        .sort(function (a, b) {
                        // Handle empty or missing yearOfPublication
                        if (!a.yearOfPublication)
                            return 1;
                        if (!b.yearOfPublication)
                            return -1;
                        // Compare dates using Date object comparison
                        var dateA = new Date(a.yearOfPublication);
                        var dateB = new Date(b.yearOfPublication);
                        // Compare timestamps to sort from newest to oldest
                        return dateB.getTime() - dateA.getTime();
                    }));
                });
                _b.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [4 /*yield*/, fetchAndSaveData("/publications/journals", "../website/content//publications/journals.json", function (data) {
                    return data
                        .filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; })
                        .sort(function (a, b) { return b.yearOfPublication - a.yearOfPublication; });
                })];
            case 7:
                journals = _b.sent();
                _a = 0, additionalPublications_2 = additionalPublications;
                _b.label = 8;
            case 8:
                if (!(_a < additionalPublications_2.length)) return [3 /*break*/, 11];
                publication = additionalPublications_2[_a];
                publicationNameForFile = publication
                    .replace(/[^a-zA-Z0-9]/g, "")
                    .toLowerCase();
                return [4 /*yield*/, fetchAndSaveData("/publications/journals?publication=".concat(publication), "../website/content//publications/".concat(publicationNameForFile, "journals.json"), function (data) {
                        return data
                            .filter(function (item) { return item.itemPublishStatus === "PUBLISHED"; })
                            .sort(function (a, b) { return b.yearOfPublication - a.yearOfPublication; });
                    })];
            case 9:
                journals_1 = _b.sent();
                _b.label = 10;
            case 10:
                _a++;
                return [3 /*break*/, 8];
            case 11: return [2 /*return*/];
        }
    });
}); };
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _i, pageDetails_1, _a, endpoint, outputFile, filter, fetchItemsWithPagination, _b, fixedData_1, _c, fileContent, outputFile;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _i = 0, pageDetails_1 = pageDetails;
                _d.label = 1;
            case 1:
                if (!(_i < pageDetails_1.length)) return [3 /*break*/, 4];
                _a = pageDetails_1[_i], endpoint = _a.endpoint, outputFile = _a.outputFile, filter = _a.filter, fetchItemsWithPagination = _a.fetchItemsWithPagination;
                return [4 /*yield*/, fetchAndSaveData(endpoint, outputFile, filter, fetchItemsWithPagination)];
            case 2:
                _d.sent();
                _d.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                _b = 0, fixedData_1 = fixedData;
                _d.label = 5;
            case 5:
                if (!(_b < fixedData_1.length)) return [3 /*break*/, 8];
                _c = fixedData_1[_b], fileContent = _c.fileContent, outputFile = _c.outputFile;
                return [4 /*yield*/, saveFixedData(fileContent, outputFile)];
            case 6:
                _d.sent();
                _d.label = 7;
            case 7:
                _b++;
                return [3 /*break*/, 5];
            case 8: return [4 /*yield*/, fetchPublicationsAndBooks()];
            case 9:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); };
main();
