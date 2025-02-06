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
                <div class="text-h6 mb-4">
                  Educational Qualification:
                  {{ selectedFaculty.educationalQualification }}
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

            <!-- display summary of each field with count => books published etc -->

            <!-- display summary based on summaryCounts -->
            <!-- display summary based on summaryCounts -->
            <!-- summary -->
            <section-title title="Summary" v-if="displaySummaryCounts" />
            <v-row justify="center" class="d-flex flex-wrap my-8">
              <div
                v-for="(count, key) in summaryCounts"
                :key="key"
                data-aos="fade-up"
                class="ma-2"
              >
                <v-card elevation="2" color="greenBg" width="300" class="ma-0">
                  <v-card-item>
                    <div class="d-flex flex-column align-center">
                      <v-icon size="40" class="mb-2">{{
                        iconsForSummary[key]
                      }}</v-icon>
                      <v-card-title
                        class="text-capitalize text-h5 font-weight-bold text-center"
                      >
                        {{ key.replace(/([A-Z])/g, " $1").trim() }}
                      </v-card-title>
                      <div class="text-h4 text-center mt-2">
                        {{ count }}
                      </div>
                    </div>
                  </v-card-item>
                </v-card>
              </div>
            </v-row>

            <!-- displayd Teaching Experience -->
            <div
              v-if="
                selectedFaculty.teachingExperience &&
                selectedFaculty.teachingExperience.length > 0
              "
            >
              <section-title title="Professional Experience" />
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

const nonAcademic = await queryContent("faculty", "nonacademic").findOne();
let nonAcademicFaculty = nonAcademic.body;
console.log("nonAcademicFaculty", nonAcademicFaculty);

faculty = [...faculty, ...nonAcademicFaculty];

// get faculty with id
const facultyItem = faculty.find((item) => item.id === id);
console.log("facultyItem", JSON.stringify(facultyItem));

if (facultyItem) {
  facultyFound.value = true;
  Object.assign(selectedFaculty, facultyItem);
}

// get summary count for phdCandidates, mphilCandidates, booksPublished, articlesPublished, projects, seminars, lectures, awards
let summaryCounts = reactive({});

let iconsForSummary = {
  phdCandidates: "mdi-school",
  mphilCandidates: "mdi-school",
  booksPublished: "mdi-book",
  articlesPublished: "mdi-book",
  projects: "mdi-briefcase",
  seminars: "mdi-account-multiple",
  lectures: "mdi-account-multiple",
  awards: "mdi-trophy",
  extensionActivities: "mdi-account-multiple",
};

let displaySummaryCounts = ref(false);

const getSummaryCount = () => {
  if (selectedFaculty.phdCandidates?.length) {
    summaryCounts.phdCandidates = selectedFaculty.phdCandidates.length;
  }
  if (selectedFaculty.mphilCandidates?.length) {
    summaryCounts.mphilCandidates = selectedFaculty.mphilCandidates.length;
  }
  if (selectedFaculty.booksPublished?.length) {
    summaryCounts.booksPublished = selectedFaculty.booksPublished.length;
  }
  if (selectedFaculty.articlesPublished?.length) {
    summaryCounts.articlesPublished = selectedFaculty.articlesPublished.length;
  }
  if (selectedFaculty.projects?.length) {
    summaryCounts.projects = selectedFaculty.projects.length;
  }
  if (selectedFaculty.seminars?.length) {
    summaryCounts.seminars = selectedFaculty.seminars.length;
  }
  if (selectedFaculty.lectures?.length) {
    summaryCounts.lectures = selectedFaculty.lectures.length;
  }
  if (selectedFaculty.awards?.length) {
    summaryCounts.awards = selectedFaculty.awards.length;
  }
  if (selectedFaculty.extensionActivities?.length) {
    summaryCounts.extensionActivities =
      selectedFaculty.extensionActivities.length;
  }

  //   if any one value is there then set displaySummaryCounts to true
  if (Object.values(summaryCounts).some((value) => value)) {
    displaySummaryCounts.value = true;
  }
};
getSummaryCount();

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
