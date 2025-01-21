<template>
  <div>
    <div v-if="isLoading">
      <v-progress-circular
        class="text-center"
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
    </div>

    <div v-else>
      <div v-if="facultyFound">
        <!-- display faculty profile -->
        <div v-if="facultyFound">
          <v-row justify="center" align="center">
            <v-col cols="12" sm="1" md="1"> </v-col>
            <v-col cols="12" sm="9" md="9"> </v-col>
          </v-row>
          <div class="text-center">
            <section-title title="Faculty Profile" />
            <!-- add back button -->

            <v-btn
              rounded="pill"
              variant="outlined"
              color="primary"
              class="my-4"
              :to="`/ksri-team/faculty`"
            >
              <v-icon icon="mdi-arrow-left" class="mr-2" />
              Back
            </v-btn>
          </div>

          <div class="ma-8">
            <v-row align="justify" justify="center">
              <v-col cols="12" sm="12" md="3" data-aos="fade-right">
                <v-img
                  :src="getAssetUrl(selectedFaculty.displayImage[0])"
                  width="300"
                  height="300"
                  fit
                  class="rounded-lg"
                />
              </v-col>
              <v-col cols="12" sm="12" md="7" data-aos="fade-left">
                <div class="text-h4 mb-4 text-secondary defaultFont">
                  {{ selectedFaculty.name }}
                </div>
                <div class="text-h6 mb-4 text-grey-darken-1">
                  {{ selectedFaculty.designation }}
                </div>
                <div class="text-subtitle-1 mb-4" style="white-space: pre-line">
                  {{ selectedFaculty.subtitle }}
                </div>
                <div class="text-body-1 mb-4" style="white-space: pre-line">
                  {{ selectedFaculty.description }}
                </div>
                <div class="d-flex align-center mb-2">
                  <v-icon icon="mdi-email" class="mr-2" />
                  <span>{{ selectedFaculty.mail }}</span>
                </div>
              </v-col>
            </v-row>

            <!-- displayd Teaching Experience -->
            <div
              v-if="
                selectedFaculty.teachingExperience &&
                selectedFaculty.teachingExperience.length > 0
              "
            >
              <section-title title="Teaching Experience" />
              <!-- simple table  -->
              <div
                class="ma-8 d-flex flex-column align-center"
                data-aos="fade-left"
              >
                <v-table
                  density="compact"
                  :style="$device.isMobile ? '' : 'width:80%'"
                >
                  <thead>
                    <tr>
                      <th class="text-left">Duration</th>
                      <th class="text-left">Organisation</th>
                      <th class="text-left">Designation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in selectedFaculty.teachingExperience"
                      :key="item.id"
                    >
                      <td>{{ item.duration }}</td>
                      <td>{{ item.organisation }}</td>
                      <td>{{ item.designation }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
            </div>
            <!-- display Phd Candidates -->
            <div
              v-if="
                selectedFaculty.phdCandidates &&
                selectedFaculty.phdCandidates.length > 0
              "
            >
              <section-title title="Phd Candidates" />
              <!-- simple table  -->
              <div
                class="ma-8 d-flex flex-column align-center"
                data-aos="fade-left"
              >
                <v-table
                  density="compact"
                  :style="$device.isMobile ? '' : 'width:80%'"
                >
                  <thead>
                    <tr>
                      <th class="text-left">Name</th>
                      <th class="text-left">Topic</th>
                      <th class="text-left">Year of Joining</th>
                      <th class="text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in selectedFaculty.phdCandidates"
                      :key="item.id"
                    >
                      <td>{{ item.name }}</td>
                      <td>{{ item.topic }}</td>
                      <td>{{ item.yearOfJoining }}</td>
                      <td>{{ item.status }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
            </div>

            <!-- display mphilCandidates -->

            <div
              v-if="
                selectedFaculty.mphilCandidates &&
                selectedFaculty.mphilCandidates.length > 0
              "
            >
              <section-title title="Mphil Candidates" />
              <!-- simple table  -->
              <div
                class="ma-8 d-flex flex-column align-center"
                data-aos="fade-left"
              >
                <v-table
                  density="compact"
                  :style="$device.isMobile ? '' : 'width:80%'"
                >
                  <thead>
                    <tr>
                      <th class="text-left">Name</th>
                      <th class="text-left">Topic</th>
                      <th class="text-left">Year of Joining</th>
                      <th class="text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in selectedFaculty.mphilCandidates"
                      :key="item.id"
                    >
                      <td>{{ item.name }}</td>
                      <td>{{ item.topic }}</td>
                      <td>{{ item.yearOfJoining }}</td>
                      <td>{{ item.status }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
            </div>

            <!-- display academicPositions -->

            <div
              v-if="
                selectedFaculty.academicPositions &&
                selectedFaculty.academicPositions.length > 0
              "
            >
              <section-title title="Academic Positions" />
              <!-- simple table  -->
              <div class="ma-8 d-flex flex-column align-center">
                <v-table
                  density="compact"
                  :style="$device.isMobile ? '' : 'width:80%'"
                >
                  <thead>
                    <tr>
                      <th class="text-left">Position</th>
                      <th class="text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in selectedFaculty.academicPositions"
                      :key="item.id"
                    >
                      <td>{{ item.position }}</td>
                      <td>{{ item.description }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
            </div>

            <!-- display booksPublished -->

            <div
              v-if="
                selectedFaculty.booksPublished &&
                selectedFaculty.booksPublished.length > 0
              "
            >
              <section-title title="Books Published" />
              <!-- simple table  -->
              <div
                class="ma-8 d-flex flex-column align-center"
                data-aos="fade-left"
              >
                <v-table
                  density="compact"
                  :style="$device.isMobile ? '' : 'width:80%'"
                >
                  <thead>
                    <tr>
                      <th class="text-left">Title</th>
                      <th class="text-left">Publisher</th>
                      <th class="text-left">Year of Publication</th>
                      <th class="text-left">ISBN</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in selectedFaculty.booksPublished"
                      :key="item.id"
                    >
                      <td>{{ item.title }}</td>
                      <td>{{ item.publisher }}</td>
                      <td>{{ item.yearOfPublication }}</td>
                      <td>{{ item.isbn }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
            </div>
            <!-- display articlesPublished -->

            <div
              v-if="
                selectedFaculty.articlesPublished &&
                selectedFaculty.articlesPublished.length > 0
              "
            >
              <section-title title="Articles Published" />
              <!-- simple table  -->
              <div
                class="ma-8 d-flex flex-column align-center"
                data-aos="fade-left"
              >
                <v-table
                  density="compact"
                  :style="$device.isMobile ? '' : 'width:80%'"
                >
                  <thead>
                    <tr>
                      <th class="text-left">Title</th>
                      <th class="text-left">Name of the Journal</th>
                      <th class="text-left">Month and Year</th>
                      <th class="text-left">ISBN/ISSN No.</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in selectedFaculty.articlesPublished"
                      :key="item.id"
                    >
                      <td>{{ item.title }}</td>
                      <td>{{ item.nameOfTheJournal }}</td>
                      <td>{{ item.monthAndYear }}</td>
                      <td>{{ item.isbnIssnNo }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
            </div>
            <!-- display projects -->

            <div
              v-if="
                selectedFaculty.projects && selectedFaculty.projects.length > 0
              "
            >
              <section-title title="Projects" />
              <!-- simple table  -->
              <div
                class="ma-8 d-flex flex-column align-center"
                data-aos="fade-left"
              >
                <v-table
                  density="compact"
                  :style="$device.isMobile ? '' : 'width:80%'"
                >
                  <thead>
                    <tr>
                      <th class="text-left">Project Title</th>
                      <th class="text-left">Sponsor</th>
                      <th class="text-left">Month and Year</th>
                      <th class="text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in selectedFaculty.projects" :key="item.id">
                      <td>{{ item.projectTitle }}</td>
                      <td>{{ item.sponsor }}</td>
                      <td>{{ item.monthAndYear }}</td>
                      <td>{{ item.description }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
            </div>
            <!-- display seminars -->

            <div
              v-if="
                selectedFaculty.seminars && selectedFaculty.seminars.length > 0
              "
            >
              <section-title title="Seminars" />
              <!-- simple table  -->
              <div
                class="ma-8 d-flex flex-column align-center"
                data-aos="fade-left"
              >
                <v-table
                  density="compact"
                  :style="$device.isMobile ? '' : 'width:80%'"
                >
                  <thead>
                    <tr>
                      <th class="text-left">Title of the Paper</th>
                      <th class="text-left">Theme</th>
                      <th class="text-left">Date</th>
                      <th class="text-left">Organisers</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in selectedFaculty.seminars" :key="item.id">
                      <td>{{ item.titleOfThePaper }}</td>
                      <td>{{ item.theme }}</td>
                      <td>{{ item.date }}</td>
                      <td>{{ item.organisers }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
            </div>

            <!-- display lectures -->
            <div
              v-if="
                selectedFaculty.lectures && selectedFaculty.lectures.length > 0
              "
            >
              <section-title title="Lectures" />
              <!-- simple table  -->
              <div
                class="ma-8 d-flex flex-column align-center"
                data-aos="fade-left"
              >
                <v-table
                  density="compact"
                  :style="$device.isMobile ? '' : 'width:80%'"
                >
                  <thead>
                    <tr>
                      <th class="text-left">Title of the Talk</th>
                      <th class="text-left">Month and Year</th>
                      <th class="text-left">Organisers</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in selectedFaculty.lectures" :key="item.id">
                      <td>{{ item.titleOfTheTalk }}</td>
                      <td>{{ item.monthAndYear }}</td>
                      <td>{{ item.organisers }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
            </div>
            <!-- display awards -->

            <div
              v-if="selectedFaculty.awards && selectedFaculty.awards.length > 0"
            >
              <section-title title="Awards" />
              <!-- simple table  -->
              <div
                class="ma-8 d-flex flex-column align-center"
                data-aos="fade-left"
              >
                <v-table
                  density="compact"
                  :style="$device.isMobile ? '' : 'width:80%'"
                >
                  <thead>
                    <tr>
                      <th class="text-left">Title</th>
                      <th class="text-left">Organisation</th>
                      <th class="text-left">Year</th>
                      <th class="text-left">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in selectedFaculty.awards" :key="item.id">
                      <td>{{ item.title }}</td>
                      <td>{{ item.organisation }}</td>
                      <td>{{ item.year }}</td>
                      <td>{{ item.remarks }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
            </div>
          </div>

          <!-- display extensionActivities -->

          <div
            v-if="
              selectedFaculty.extensionActivities &&
              selectedFaculty.extensionActivities.length > 0
            "
          >
            <section-title title="Extension Activities" />
            <!-- simple table  -->
            <div
              class="ma-8 d-flex flex-column align-center"
              data-aos="fade-left"
            >
              <v-table
                density="compact"
                :style="$device.isMobile ? '' : 'width:80%'"
              >
                <thead>
                  <tr>
                    <th class="text-left">Title</th>
                    <th class="text-left">Month and Year</th>
                    <th class="text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in selectedFaculty.extensionActivities"
                    :key="item.id"
                  >
                    <td>{{ item.title }}</td>
                    <td>{{ item.monthAndYear }}</td>
                    <td>{{ item.description }}</td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        <div class="ma-8 text-center">
          <div
            class="text-h4 my-8 text-secondary defaultFont"
            data-aos="fade-right"
          >
            Faculty details Not Found
          </div>
          <v-btn color="primary" variant="outlined" to="/ksri-team/faculty/">
            Back to Faculty
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// get id from url
const route = useRoute();
const id = route.params.id;

let isLoading = ref(true);
let facultyFound = ref(false);
let selectedFaculty = reactive({});

const facultyData = await queryContent("faculty", "faculty").findOne();
let faculty = facultyData.body;
console.log("faculty", faculty);

// get faculty with id
const facultyItem = faculty.find((item) => item.id === id);
console.log("facultyItem", JSON.stringify(facultyItem));

if (facultyItem) {
  facultyFound.value = true;
  Object.assign(selectedFaculty, facultyItem);
}

let sampleFaculty = {
  id: "01JGM5VST7RMFAQA7MXH1WB9KH",
  name: "Dr. V. Yamuna Devi",
  designation: "Deputy Director/Associate Professor",
  displayImage: ["upload/faculty/dr-v-yamuna-devi.jpg"],
  subtitle:
    "Areas of Specialisation: Lexicography, Vyakarana, Literature and Dharma Sastra.",
  description:
    "More than 15 years of teaching and research experience.\nGuided many M.Phil. and Ph.D Research Scholars to work on Ancient Indian Mathematics, Advaita and related fields.",
  mobile: "044-24985320",
  mail: "ksriphd@gmail.com",
  profile: ["upload/media/Dr.Yamuna C.V July 2024.pdf"],
  type: "ACADEMIC",
  metadata: {
    updated_by: "demo",
    created_at: "2025-01-02T18:53:50.279Z",
    updated_at: "2025-01-11T08:26:53.398Z",
    created_by: "admin",
  },
  orderId: "1",
  teachingExperience: [
    {
      duration: "Presently",
      organisation: "The KSRI, Chennai",
      designation: "Associate Professor",
    },
    {
      duration: "From Sep. 2014 -2023",
      organisation: "The KSRI, Chennai",
      designation: "Assistant Professor",
    },
    {
      duration: "2012-14",
      organisation: "The KSRI, Chennai",
      designation: "Hon. Research Assistant",
    },
    {
      duration: "2005-2012",
      organisation: "Stella Maris College",
      designation: "Lecturer",
    },
  ],
  phdCandidates: [
    {
      name: "Dr. S.Madhurambika",
      topic: "Sahendravilāsa of Sridhara Ayyaval – Acritical Study",
      yearOfJoining: "2017",
      status: "Degree awarded",
    },
    {
      name: "Mr.P.S.Chandrasekhar",
      topic:
        "Kshetra Ganita in Ganita Kaumudi of Narayana Pandita- A Critical Study",
      yearOfJoining: "2018-2023",
      status: "Thesis Submitted",
    },
    {
      name: "Ms. B.Vijayalakshmi",
      topic:
        "Arithmetic and Geometric Progression in Ancient Indian Mathematics A Study",
      yearOfJoining: "2018-2025",
      status: "Synopsis submitted",
    },
    {
      name: "Ms. Lavamya.V.Eswar",
      topic:
        "Yogavasishta –Vairagya and Mumukshu Kandas in the light of the commentary of Ananda Bodhendra Sarasvati",
      yearOfJoining: "2019-2025",
      status: "Synopsis submitted",
    },
    {
      name: "Mr.V. R. Srinivasan",
      topic: "24 Maheshvaramurtas as in Agamas",
      yearOfJoining: "2022-2027",
      status: "Ongoing",
    },
  ],
  mphilCandidates: [
    {
      name: "Ms.Mrinalini",
      topic: "Sandilyopanisad- A Critical study",
      yearOfJoining: "2016-17",
      status: "Completed",
    },
    {
      name: "Ms.Latha",
      topic: "Krishnabhupaliyam",
      yearOfJoining: "2016-17",
      status: "Completed",
    },
    {
      name: "Ms.Rajalakshmi",
      topic: "Cola Campu",
      yearOfJoining: "2016-17",
      status: "Completed",
    },
    {
      name: "Ms.Ramya Bhatt",
      topic: "Significance of Vadavagni",
      yearOfJoining: "2016-17",
      status: "Completed",
    },
    {
      name: "Ms. J Mythili",
      topic: "Yogakundalini Upanisad",
      yearOfJoining: "2017-18",
      status: "Completed",
    },
    {
      name: "Ms. Iswarya",
      topic: "Yogacudamani Upanisad- A Critical study",
      yearOfJoining: "2018-2019",
      status: "Completed",
    },
    {
      name: "Mr. V.R.Srinivasan",
      topic: "Manjuramayana of Srinidhi – A Critical Study",
      yearOfJoining: "2020-21",
      status: "Completed",
    },
    {
      name: "Ms. Gayathri",
      topic: "Sammārjanī Śatakam of Asoori Ānandāl̥vār - A critical study",
      yearOfJoining: "2021-22",
      status: "Completed",
    },
    {
      name: "Mr. L. Sriram",
      topic: "Bharatī Manoratham of M. K. Tatachariar – A critical Study",
      yearOfJoining: "2022-23",
      status: "Completed",
    },
  ],
  academicPositions: [
    {
      description:
        "for Doctoral Programme at The Madras Sanskrit College and The University of Madras",
      position: "Research Advisory Committee",
    },
    { description: "The Madras Sanskrit College", position: "IQAC MEMBER" },
    {
      description:
        "External Examiner conducting Viva-Voce for The University of Madras, and Certificate and Diploma Courses at the Madras Sanskrit College",
      position: "External Examiner conducting Viva-Voce",
    },
    {
      description:
        "The KSRI publications and The Samskrita Academy, Madras Publications",
      position: "Editorial Member",
    },
  ],
  booksPublished: [
    {
      publisher: "The Samskrit Academy, Chennai",
      yearOfPublication: "2024",
      title: "SANDHI",
      sNo: "1",
      remarks: "Published",
      isbn: "978-81-954078-6-6",
    },
    {
      publisher: "Karnataka Historical Research Society, Dharwad",
      yearOfPublication: "2017",
      title: "AMARAKOÑODGHÄÖANA OF KÑÉRASVÄMIN: A SOCIO-CULTURAL STUDY",
      sNo: "2",
      remarks: "Published",
      isbn: "978-81-936580",
    },
    {
      publisher: "Karnataka Historical Research Society, Dharwad",
      yearOfPublication: "2017",
      title: "ASPECTS OF NATURE IN AMARAKOÑODGHÄÖANA OF KÑÉRASVÄMIN",
      sNo: "3",
      remarks: "Published",
      isbn: "078-93-87761-00-1",
    },
    {
      publisher: "The Samskrit Academy, Chennai",
      yearOfPublication: "2016",
      title: "SHRUTI GITA with Eng. Translation along with Dr. T.V. Vasudeva",
      sNo: "4",
      remarks: "Published",
      isbn: "978-81-931170-0-2",
    },
  ],
  articlesPublished: [
    {
      monthAndYear: "2024",
      nameOfTheJournal: "The Festivals of India Ed. C. Rajendran",
      title: "Temple festival -Vajramakuta Utsava at Melkote",
      sNo: "1",
      isbnIssnNo: "ISBN 978-81-8315-546-5",
      remarks: "pub. by New Bharatiya Book Corporation Delhi",
    },
    {
      monthAndYear: "2024",
      nameOfTheJournal: "Journal of Oriental Research Vol. XCIV",
      title:
        "A few yogic practices for the cure of diseases as gleaned from some Haṭha yoga texts",
      sNo: "2",
      isbnIssnNo: "ISSN 0022-3301",
      remarks: "The Kuppuswami Sastri Research Institute Chennai",
    },
    {
      monthAndYear: "2023",
      nameOfTheJournal: "Some Aspects of Manuscriptology, MDKG College",
      title: "Eras used in the Indian manuscripts",
      sNo: "3",
      isbnIssnNo: "ISBN 978-93-5967-933-4",
      remarks: "Dibrugarh Assam",
    },
    {
      monthAndYear: "Sep 2023",
      nameOfTheJournal:
        "Pracya Vol-XV 'Āyurveda viśeṣāṅka' Dept. Of Sanskrit, M.D.K. Girls College Dibrugarh",
      title:
        "Medication for both bhavaroga and deharoga – As described in the Jñāna Bhaiṣajya Mañjarī of Gumāni",
      sNo: "4",
      isbnIssnNo: "ISSN 2278-4004",
      remarks: "",
    },
    {
      monthAndYear: "2023",
      nameOfTheJournal: "Journal of Oriental Research Vol. XCIII",
      title: "Avyayas as dealt with by Bhoja in Srngaraprakasa",
      sNo: "5",
      isbnIssnNo: "ISSN 0022-3301",
      remarks: "The Kuppuswami Sastri Research Institute Chennai",
    },
    {
      monthAndYear: "2023",
      nameOfTheJournal: "Journal of Madras Sanskrit College",
      title: "Nārāyaṇīye śabdacitravaicitryam, Rasikapriya",
      sNo: "6",
      isbnIssnNo: "ISSN 24542547",
      remarks: "Chennai",
    },
  ],
  projects: [
    {
      description: "",
      monthAndYear: "2023-2025",
      sponsor: "CSU",
      remarks: "Ongoing",
      projectTitle: "CRITICAL EDITION OF VĪRACARITAM OF ANANTAKAVI",
    },
  ],
  seminars: [
    {
      date: "Feb. 29, 2024",
      monthAndYear: "2024",
      organisers:
        "Dept. of Sanskrit, JBAS college for women (Autonomous), Chennai",
      theme: "Seminar on Nature preservation-The bygone ways",
      titleOfThePaper: "Nature preservation methods",
      slNo: "1",
    },
    {
      date: "Nov 24 & 25, 2023",
      monthAndYear: "2023",
      organisers: "The KSRI, Chennai",
      theme: "National Seminar on Bhakti Literature in Sanskrit and Tamil",
      titleOfThePaper: "Deśabhakti",
      slNo: "2",
    },
    {
      date: "Aug. 21 & 22, 2023",
      monthAndYear: "2023",
      organisers: "The KSRI, Chennai",
      theme: "National Seminar on Arts and Architecture",
      titleOfThePaper: "Dhātukalā- Metallurgy and Alloy making",
      slNo: "3",
    },
    {
      date: "January 8th and 9th, 2023",
      monthAndYear: "2023",
      organisers:
        "The Madras Sanskrit College & S.S.V. Patasala, Chennai jointly with Central Sanskrit University, New Delhi",
      theme: "International Seminar on Sriman- Narayaneeyam",
      titleOfThePaper: "Nārāyaṇīye śabdacitravaicitryam",
      slNo: "4",
    },
    {
      date: "December 9th & 10th, 2022",
      monthAndYear: "2022",
      organisers:
        "Sanskrit Dept., Assam University in collaboration with Samskrit Bharati",
      theme:
        "International Seminar on Science and Technology in Sanskrit texts",
      titleOfThePaper:
        "Extraction and Application of Natural Dyes as recorded in Sanskrit literature",
      slNo: "5",
    },
    {
      date: "April 10th, 2022",
      monthAndYear: "2022",
      organisers: "The Veda Samskriti Samiti, Hyderabad",
      theme:
        "National level Webinar on The roots of Modern science in Veda Samskrita Vanmayam",
      titleOfThePaper: "The health benefits of chewing Tambulam",
      slNo: "6",
    },
    {
      date: "March 26-27th, 2022",
      monthAndYear: "2022",
      organisers: "Indic Academy held at Cotton University, Guwahati, Assam",
      theme: "International Conference on Feminine in Hinduism",
      titleOfThePaper:
        "The Two less-known Women Role Models of the 17-18th Cent. C.E. Queen Dīpāmbā – the Diplomat and Āvuḍai Akkā- the Advaitin",
      slNo: "7",
    },
    {
      date: "February 26-28th, 2022",
      monthAndYear: "2022",
      organisers: "Dept. of Mathematics, Hindu Girls College, Sonipat, Haryana",
      theme: "Online National Conference on Indian Scientific Heritage",
      titleOfThePaper:
        "Some Fundamental concepts in Physics and Chemistry in sanskrit Nyaya texts",
      slNo: "8",
    },
  ],
  lectures: [
    {
      monthAndYear: "24th Jan 2024",
      organisers: "The SASTRA Deemed to be University sponsored by the ICPR",
      slNo: "1",
      titleOfTheTalk:
        "Thoughts of science and technology in Indian philosophical systems",
    },
    {
      monthAndYear: "28th December, 2023",
      organisers:
        "IQAC and school of languages, Shri Shankarlal Sundarbai Shashun Jain College for women",
      slNo: "2",
      titleOfTheTalk:
        "The Importance of Journals, Articles & Indexing with respect to Patents",
    },
    {
      monthAndYear: "26th December, 2022",
      organisers:
        "Department of Sanskrit, MES Kishora Kendra Pre-University College, Bangalore",
      slNo: "3",
      titleOfTheTalk: "Relevance of Sanskrit Studies",
    },
    {
      monthAndYear: "25th August 2022",
      organisers:
        "Sarasvata Samiti, Sanskrit Club, Dept. of Sanskrit, M O P Vaishnav College for women",
      slNo: "4",
      titleOfTheTalk: "Samskrtam Samskrtishca",
    },
    {
      monthAndYear: "12th May, 2022",
      organisers: "Silicon Andhra University",
      slNo: "5",
      titleOfTheTalk:
        "Vachika Abhinaya/aspects of Sanskrit drama from Natya Shastra",
    },
    {
      monthAndYear: "28th April, 2022",
      organisers: "Department of Sanskrit, MGR Janaki College for women",
      slNo: "6",
      titleOfTheTalk: "Sanskrit Literature : Reflection of Life challenges",
    },
  ],
  awards: [],
  extensionActivities: [
    {
      description:
        "Conducted Orientation programmes for teachers – Amrita Vidyalayam Tamilnadu and Pondicherry, three day cultural Education Camp. A session on Sanatana Dharma",
      monthAndYear: "30th April, 2024",
      title: "Teacher Orientation Programme",
      slNo: "1",
    },
    {
      description:
        "Talk on 'Values in the Ramayana' delivered in Siva Swamy Kalalaya School, Vidya Mandir School, Mylapore, and Bala Vidya Mandir, Adayar, Chennai",
      monthAndYear: "2015",
      title: "School Lectures",
      slNo: "2",
    },
    {
      description:
        "AIR TALK - Mangala ślokangalum kavigalum featured in 101.4 FM 2.45 pm Sanskrit program",
      monthAndYear: "23rd and 30th July 2024",
      title: "Radio Programme",
      slNo: "3",
    },
    {
      description:
        "Judge for the Samanyabhasanaspardha on 'Bharata svatantrya- mahotsavah Samskritagyanam Yogadaanan ca'",
      monthAndYear: "14th October, 2022",
      title: "Sanskrit Week Celebration",
      slNo: "4",
    },
  ],
  itemPublishStatus: "PUBLISHED",
};

Object.assign(selectedFaculty, faculty);

isLoading.value = false;
</script>

<style>
/*style table header and add bg color to alternate rows*/

/*thead {
  background-color: #ebeeeb;
  color: #0a160f;
  font-weight: bold !important;
  font-size: 16px;
}*/
</style>
