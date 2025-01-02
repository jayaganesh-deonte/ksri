<template>
  <div>
    <v-progress-circular
      v-if="isLoading"
      indeterminate
      color="primary"
    ></v-progress-circular>
    <generic-crud
      v-if="!isLoading"
      entityName="Faculty"
      :apiEndpoint="apiEndpoint"
      :entityFields="facultyFields"
      :headers="facultyHeaders"
      :addIdToPayload="true"
    />
  </div>
</template>

<script setup>
import axios from "axios";
import { getUserIdToken } from "@/services/auth";
import { ref } from "vue";

const apiEndpoint = import.meta.env.VITE_API_URL + "/faculty";

let isLoading = ref(true);

// {
//     "name": "Dr. K.S.Balasubramanian",
//     "designation": "Director",
//     "displayImage": "https://d30y75l38k1y9.cloudfront.net/upload/faculty/dr-k-s-balasubramanian.jpg",
//     "subtitle": "Areas of Specialisation: Yoga, Literature, Philosophy",
//     "description": "More than 35 years of teaching and research experience.\nGuided many Research Scholars to work on Yoga and related fields.",
//     "mobile": "9884899716",
//     "mail": "sanskritkannan@yahoo.com",
//     "profile": "https://d30y75l38k1y9.cloudfront.net/upload/media/Dr.K.S.Balasubramanian.docx"
// }
const fetchFacultyDesignations = async () => {
  const idToken = await getUserIdToken();

  const response = await axios.get(
    import.meta.env.VITE_API_URL + "/faculty/designation",
    {
      headers: {
        Authorization: `${idToken}`,
      },
    }
  );
  // get only names
  const names = response.data.map((item) => item.name);
  return names;
};

let designations = await fetchFacultyDesignations();
console.log("designations", designations);

const facultyFields = [
  //
  {
    key: "orderId",
    label: "Order Id",
    type: "number",
    rules: [(v) => !!v || "Order Id is required"],
    // editDisabled: true,
  },
  {
    key: "name",
    label: "Name",
    type: "text",
    rules: [(v) => !!v || "Name is required"],
    // editDisabled: true,
  },
  {
    key: "itemPublishStatus",
    label: "Publish Status",
    type: "auto-complete",
    rules: [(v) => !!v || "Publish Status is required"],
    items: ["PUBLISHED", "DRAFT"],
  },
  {
    key: "type",
    label: "Type",
    type: "auto-complete",
    items: ["ACADEMIC", "NON ACADEMIC"],
    rules: [(v) => !!v || "Type is required"],
  },
  {
    key: "designation",
    label: "Designation",
    type: "auto-complete",
    items: designations,
  },

  {
    key: "subtitle",
    label: "Areas of Specialisation",
    type: "text",
    rules: [(v) => !!v || "Areas of Specialisation is required"],
  },
  {
    key: "description",
    label: "Description",
    type: "textarea",
    rules: [(v) => !!v || "Description is required"],
  },
  {
    key: "mobile",
    label: "Mobile",
    type: "text",
    rules: [(v) => !!v || "Mobile number is required"],
  },
  {
    key: "mail",
    label: "Email",
    type: "text",
    rules: [(v) => !!v || "Email is required"],
  },
  {
    key: "profile",
    label: "Profile Document",
    type: "document",
    rules: [(v) => !!v || "Profile Document is required"],
  },
  {
    key: "displayImage",
    label: "Display Image",
    type: "image",
  },
  // {
  //   key: "achievementCounts",
  //   label: "Summary Counts",
  //   isArray: true,
  //   fields: [
  //     {
  //       key: "name",
  //       label: "Name",
  //       type: "text",
  //     },
  //     {
  //       key: "count",
  //       label: "Count",
  //       type: "text",
  //     },
  //   ],
  // },
  // teachingExperience
  {
    key: "teachingExperience",
    label: "Teaching Experience",
    isArray: true,
    fields: [
      {
        key: "designation",
        label: "Designation",
        type: "text",
      },
      {
        key: "organisation",
        label: "Organisation / Institution",
        type: "text",
      },
      {
        key: "duration",
        label: "Duration",
        type: "text",
      },
    ],
  },
  // phdCandidates
  {
    key: "phdCandidates",
    label: "Phd Candidates",
    isArray: true,
    fields: [
      // Name	Topic	Year of Joining	Status
      {
        key: "name",
        label: "Name",
        type: "text",
      },
      {
        key: "topic",
        label: "Topic",
        type: "text",
      },
      {
        key: "yearOfJoining",
        label: "Year of Joining",
        type: "text",
      },
      {
        key: "status",
        label: "Status",
        type: "auto-complete",
        items: [
          "Degree awarded",
          "Thesis submitted",
          "Synopsis submitted",
          "Ongoing",
        ],
      },
    ],
  },
  // mphilCandidates
  {
    key: "mphilCandidates",
    label: "Mphil Candidates",
    isArray: true,
    fields: [
      // Name	Topic	Year of Joining	Status
      {
        key: "name",
        label: "Name",
        type: "text",
      },
      {
        key: "topic",
        label: "Topic",
        type: "text",
      },
      {
        key: "yearOfJoining",
        label: "Year of Joining",
        type: "text",
      },
      {
        key: "status",
        label: "Status",
        type: "auto-complete",
        items: [
          "Degree awarded",
          // "Thesis submitted",
          // "Synopsis submitted",
          "Ongoing",
        ],
      },
    ],
  },
  // academicPositions
  {
    key: "academicPositions",
    label: "Academic Positions",
    isArray: true,
    fields: [
      // Position	Duration
      {
        key: "position",
        label: "Position",
        type: "text",
      },
      {
        key: "description",
        label: "Description",
        type: "text",
      },
    ],
  },
  // booksPublished
  {
    key: "booksPublished",
    label: "Books Published",
    isArray: true,
    fields: [
      // S.No.	Title	Publisher	Year of publication	ISBN	Remarks
      {
        key: "sNo",
        label: "S.No.",
        type: "text",
      },
      {
        key: "title",
        label: "Title",
        type: "text",
      },
      {
        key: "publisher",
        label: "Publisher",
        type: "text",
      },
      {
        key: "yearOfPublication",
        label: "Year of publication",
        type: "text",
      },
      {
        key: "isbn",
        label: "ISBN",
        type: "text",
      },
      {
        key: "remarks",
        label: "Remarks",
        type: "auto-complete",
        items: ["Published", "To be published", "On-Going"],
      },
    ],
  },
  // articlesPublished
  {
    key: "articlesPublished",
    label: "Articles Published",
    isArray: true,
    fields: [
      // S.NO.	Title	Name of the Journal / Book / Magazine 	Month and Year	ISBN / ISSN No.	Remarks
      {
        key: "sNo",
        label: "S.No.",
        type: "text",
      },
      {
        key: "title",
        label: "Title",
        type: "text",
      },
      {
        key: "nameOfTheJournal",
        label: "Name of the Journal / Book / Magazine",
        type: "text",
      },
      {
        key: "monthAndYear",
        label: "Month and Year",
        type: "text",
      },
      {
        key: "isbnIssnNo",
        label: "ISBN / ISSN No.",
        type: "text",
      },
      {
        key: "remarks",
        label: "Remarks",
        type: "auto-complete",
        items: ["Published", "To be published"],
      },
    ],
  },
  // projects
  {
    key: "projects",
    label: "Projects",
    isArray: true,
    fields: [
      // Project Title	sponsor	Month and Year	ISBN	Remarks
      {
        key: "projectTitle",
        label: "Project Title",
        type: "text",
      },
      // description
      {
        key: "description",
        label: "Description",
        type: "text",
      },

      {
        key: "sponsor",
        label: "Sponsor",
        type: "text",
      },
      {
        key: "monthAndYear",
        label: "Month and Year",
        type: "text",
      },
      {
        key: "remarks",
        label: "Remarks",
        type: "auto-complete",
        items: ["Completed", "On-Going", "Future Project"],
      },
    ],
  },
  // seminars
  {
    key: "seminars",
    label: "Seminar / Conference",
    isArray: true,
    fields: [
      // Sl.No 	Title of the paper	Seminar /Conference	Organisers	Month and Year
      {
        key: "slNo",
        label: "Sl.No",
        type: "text",
      },
      {
        key: "titleOfThePaper",
        label: "Title of the paper",
        type: "text",
      },
      {
        key: "theme",
        label: "Theme",
        type: "text",
      },
      {
        key: "organisers",
        label: "Organisers",
        type: "text",
      },
      {
        key: "monthAndYear",
        label: "Month and Year",
        type: "text",
      },
    ],
  },
  // lectures
  {
    key: "lectures",
    label: "Lectures / Talks delivered",
    isArray: true,
    fields: [
      // Sl.No 	TITLE OF THE TALK / LECTURE	ORGANISERS	Month and Year	YEAR
      {
        key: "slNo",
        label: "Sl.No",
        type: "text",
      },
      {
        key: "titleOfTheTalk",
        label: "TITLE OF THE TALK / LECTURE",
        type: "text",
      },
      {
        key: "organisers",
        label: "ORGANISERS",
        type: "text",
      },
      {
        key: "monthAndYear",
        label: "Month and Year",
        type: "text",
      },
    ],
  },
  // awards
  {
    key: "awards",
    label: "Awards & Recognitions",
    isArray: true,
    fields: [
      // Sl.No 	Title	Organisation	Year
      {
        key: "slNo",
        label: "Sl.No",
        type: "text",
      },
      {
        key: "title",
        label: "Title",
        type: "text",
      },
      {
        key: "organisation",
        label: "Organisation",
        type: "text",
      },
      {
        key: "year",
        label: "Year",
        type: "text",
      },
      {
        key: "remarks",
        label: "Remarks",
        type: "text",
      },
    ],
  },
  //  Extension Activities
  {
    key: "extensionActivities",
    label: "Extension Activities",
    isArray: true,
    fields: [
      // Sl.No 	Title	Organisation	Year
      {
        key: "slNo",
        label: "Sl.No",
        type: "text",
      },
      {
        key: "title",
        label: "Title",
        type: "text",
      },
      {
        key: "description",
        label: "Description",
        type: "text",
      },
      {
        key: "monthAndYear",
        label: "Month and Year",
        type: "text",
      },
    ],
  },
];

const facultyHeaders = [
  {
    key: "orderId",
    title: "Order Id",
  },
  {
    key: "name",
    title: "Name",
  },
  {
    key: "designation",
    title: "Designation",
  },
  {
    key: "type",
    title: "Type",
  },
  {
    key: "subtitle",
    title: "Specialisation",
  },
  // {
  //   key: "description",
  //   title: "Description",
  // },
  // {
  //   key: "mobile",
  //   title: "Mobile",
  // },
  {
    key: "mail",
    title: "Email",
  },
  { key: "actions", title: "Actions" },
];

isLoading.value = false;
</script>
