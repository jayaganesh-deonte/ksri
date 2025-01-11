<script setup>
import { usePDF } from "vue3-pdfmake";
import axios from "axios";

const pdfmake = usePDF({
  autoInstallVFS: true,
});

const getImageUrl = (image) => {
  return import.meta.env.VITE_IMAGE_CLOUDFRONT + image;
};

// faculty data from props
const { editedItem } = defineProps(["editedItem"]);

// const profileImage = getImageUrl(editedItem?.displayImage);

const encodeUTF8 = (str) => {
  if (!str) return "";
  return decodeURIComponent(encodeURIComponent(str));
};

const urlToBase64 = async (url) => {
  // get html document add a image to a canvas and return base64 string
  const response = await fetch(url, { mode: "no-cors" });
  const blob = await response.blob();
  // convert to base64 string
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      console.log("reader.result", reader.result);
      // return reader.result.split(",")[1];
      resolve(reader.result.split(",")[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};
// const profileImage = await getImageDataUrl(editedItem.displayImage);

const onGenPDF = async () => {
  const docDefinition = {
    content: [
      // // Profile Image
      // editedItem?.displayImage && {
      //   image: await urlToBase64(
      //     import.meta.env.VITE_IMAGE_CLOUDFRONT + editedItem.displayImage
      //   ),
      //   width: 150,
      //   alignment: "center",
      //   margin: [0, 0, 0, 20],
      // },

      // Header Section
      {
        text: encodeUTF8(editedItem?.name),
        style: "header",
        alignment: "center",
      },
      {
        text: encodeUTF8(editedItem?.designation),
        style: "subheader",
        alignment: "center",
      },
      {
        text: encodeUTF8(editedItem?.subtitle),
        style: "subheader",
        alignment: "center",
        margin: [0, 0, 0, 20],
      },

      // Contact Information
      {
        columns: [
          {
            width: "auto",
            text: `Email: ${encodeUTF8(editedItem?.mail)}`,
          },
          // {
          //   width: "auto",
          //   text: editedItem?.mobile
          //     ? `Mobile: ${encodeUTF8(editedItem.mobile)}`
          //     : "",
          // },
        ],
        margin: [0, 0, 0, 20],
      },

      // Description
      editedItem?.description && {
        text: "Description",
        style: "sectionHeader",
      },
      editedItem?.description && {
        text: encodeUTF8(editedItem.description),
        margin: [0, 5, 0, 15],
      },

      // Academic Positions
      editedItem?.academicPositions?.length > 0 && {
        text: "Academic Positions",
        style: "sectionHeader",
      },
      editedItem?.academicPositions?.length > 0 && {
        table: {
          headerRows: 1,
          widths: ["*", "*"],
          body: [
            ["Position", "Description"],
            ...editedItem.academicPositions.map((pos) => [
              encodeUTF8(pos?.position),
              encodeUTF8(pos?.description),
            ]),
          ],
        },
        margin: [0, 5, 0, 15],
      },

      // Teaching Experience
      editedItem?.teachingExperience?.length > 0 && {
        text: "Teaching Experience",
        style: "sectionHeader",
      },
      editedItem?.teachingExperience?.length > 0 && {
        table: {
          headerRows: 1,
          widths: ["*", "*", "*"],
          body: [
            ["Organisation", "Designation", "Duration"],
            ...editedItem.teachingExperience.map((exp) => [
              encodeUTF8(exp?.organisation),
              encodeUTF8(exp?.designation),
              encodeUTF8(exp?.duration),
            ]),
          ],
        },
        margin: [0, 5, 0, 15],
      },

      // Books Published
      editedItem?.booksPublished?.length > 0 && {
        text: "Books Published",
        style: "sectionHeader",
      },
      editedItem?.booksPublished?.length > 0 && {
        table: {
          headerRows: 1,
          widths: ["*", "auto", "auto", "auto"],
          body: [
            ["Title", "Publisher", "Year", "ISBN"],
            ...editedItem.booksPublished.map((book) => [
              encodeUTF8(book?.title),
              encodeUTF8(book?.publisher),
              encodeUTF8(book?.yearOfPublication),
              encodeUTF8(book?.isbn),
            ]),
          ],
        },
        margin: [0, 5, 0, 15],
      },

      // Articles Published
      editedItem?.articlesPublished?.length > 0 && {
        text: "Articles Published",
        style: "sectionHeader",
      },
      editedItem?.articlesPublished?.length > 0 && {
        table: {
          headerRows: 1,
          widths: ["*", "*", "auto"],
          body: [
            ["Title", "Journal", "Date"],
            ...editedItem.articlesPublished.map((article) => [
              encodeUTF8(article?.title),
              encodeUTF8(article?.nameOfTheJournal),
              encodeUTF8(article?.monthAndYear),
            ]),
          ],
        },
        margin: [0, 5, 0, 15],
      },

      // Seminars
      editedItem?.seminars?.length > 0 && {
        text: "Seminars & Conferences",
        style: "sectionHeader",
      },
      editedItem?.seminars?.length > 0 && {
        table: {
          headerRows: 1,
          widths: ["*", "*", "auto"],
          body: [
            ["Title", "Organisers", "Date"],
            ...editedItem.seminars.map((seminar) => [
              encodeUTF8(seminar?.titleOfThePaper),
              encodeUTF8(seminar?.organisers),
              encodeUTF8(seminar?.monthAndYear),
            ]),
          ],
        },
        margin: [0, 5, 0, 15],
      },

      // Lectures
      editedItem?.lectures?.length > 0 && {
        text: "Lectures",
        style: "sectionHeader",
      },
      editedItem?.lectures?.length > 0 && {
        table: {
          headerRows: 1,
          widths: ["*", "*", "auto"],
          body: [
            ["Title", "Organisers", "Date"],
            ...editedItem.lectures.map((lecture) => [
              encodeUTF8(lecture?.titleOfTheTalk),
              encodeUTF8(lecture?.organisers),
              encodeUTF8(lecture?.monthAndYear),
            ]),
          ],
        },
        margin: [0, 5, 0, 15],
      },

      // Awards
      editedItem?.awards?.length > 0 && {
        text: "Awards & Recognition",
        style: "sectionHeader",
      },
      editedItem?.awards?.length > 0 && {
        table: {
          headerRows: 1,
          widths: ["*", "*", "auto"],
          body: [
            ["Title", "Organisation", "Year"],
            ...editedItem.awards.map((award) => [
              encodeUTF8(award?.title),
              encodeUTF8(award?.organisation),
              encodeUTF8(award?.year),
            ]),
          ],
        },
        margin: [0, 5, 0, 15],
      },

      // Extension Activities
      editedItem?.extensionActivities?.length > 0 && {
        text: "Extension Activities",
        style: "sectionHeader",
      },
      editedItem?.extensionActivities?.length > 0 && {
        table: {
          headerRows: 1,
          widths: ["*", "*", "auto"],
          body: [
            ["Title", "Activity", "Date"],
            ...editedItem.extensionActivities.map((activity) => [
              encodeUTF8(activity?.title),
              encodeUTF8(activity?.activity),
              encodeUTF8(activity?.date),
            ]),
          ],
        },
        margin: [0, 5, 0, 15],
      },

      // Projects
      editedItem?.projects?.length > 0 && {
        text: "Research Projects",
        style: "sectionHeader",
      },
      editedItem?.projects?.length > 0 && {
        table: {
          headerRows: 1,
          widths: ["*", "*", "auto"],
          body: [
            ["Project Title", "Sponsor", "Status"],
            ...editedItem.projects.map((project) => [
              encodeUTF8(project?.projectTitle),
              encodeUTF8(project?.sponsor),
              encodeUTF8(project?.remarks),
            ]),
          ],
        },
        margin: [0, 5, 0, 15],
      },
    ].filter(Boolean),
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 5],
      },
      sectionHeader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 10],
        decoration: "underline",
      },
    },
    // defaultStyle: {
    //   font: "Times-Roman",
    //   fontSize: 10,
    // },
    pageSize: "A4",
    pageMargins: [40, 40, 40, 40],
  };

  console.log("docDefinition", docDefinition);
  pdfmake
    .createPdf(docDefinition)
    .open()
    .catch((error) => console.error(error));
};
</script>

<template>
  <v-btn @click="onGenPDF"> Download faculty data </v-btn>
</template>
