<template>
  <div class="mx-8">
    <div>
      <section-title title="ACADEMIC PROGRAMS" />
      <div class="sectionBody">
        KSRI is affiliated to the University of Madras and offers Ph.D.
        programmes in Sanskrit. M.Phil. is not offered by University of Madras
        from 2024.
      </div>
      <div class="sectionBody">
        Eligiblity: Candidates who have M.A. Sanskrit and the eligibility norms
        as prescribed by the UGC and University of Madras may apply for the
        same. For applications, check the website of University of Madras.
      </div>
    </div>
    <!-- simple table with supervisors details cols Name	Number of scholars pursuing Ph.D. under them	Vacancy -->
    <div class="ma-8 d-flex flex-column align-center">
      <div class="sectionTitle2" data-aos="fade-up">Supervisor / Guide</div>
      <v-table :style="$device.isMobile ? '' : 'width:60%'">
        <thead>
          <tr>
            <th class="text-left text-body-1 text-secondary">Name</th>
            <th class="text-left text-body-1 text-secondary">Period</th>
            <th class="text-left text-body-1 text-secondary">
              Number of Research Scholars
            </th>
            <th class="text-left text-body-1 text-secondary">Vacancy</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="supervisor in supervisors" :key="supervisor.name">
            <tr
              class="text-body-1 text-center"
              v-if="supervisor.noOfphdStudents"
            >
              <td>{{ supervisor.name }}</td>
              <td>{{ supervisor.period }}</td>
              <td>{{ supervisor.noOfphdStudents }}</td>
              <td>{{ supervisor.vacancy }}</td>
            </tr>
          </template>
          <!-- last row with colspan 4 with text For more details about research scholars and their Thesis "Click here". -->
          <tr style="background-color: orange">
            <td colspan="4" class="text-center text-h6">
              For more details about research scholars and their Thesis
              <a
                href="/academic-and-research-pursuits/scholars-gateway"
                style="color: #bf641f; text-decoration: none; font-weight: bold"
                >"Click here".
              </a>
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>
    <div class="ma-8 mt-16 sectionBody text-center">
      Currently the Scholars pursuing Research under these programs are given
      below
    </div>
    <ModernScholars :past="false" :displayFilterBasedOnCourseBtn="false" />
  </div>
</template>

<script setup>
useSeoMeta({
  title: "Academic Programs",
  description:
    "KSRI is affiliated to the University of Madras and offers Ph.D programs. Scholars pursuing Research under these programs",
  ogTitle: "Academic Programs",
  ogDescription:
    "KSRI is affiliated to the University of Madras and offers Ph.D programs. Scholars pursuing Research under these programs",
  twitterTitle: "Academic Programs",
  twitterDescription:
    "KSRI is affiliated to the University of Madras and offers Ph.D programs. Scholars pursuing Research under these programs",
});
import ModernScholars from "./scholars-gateway/components/ModernScholars.vue";

const supervisorsData = await queryContent("supervisordetails").findOne();

const supervisors = supervisorsData.body.sort((a, b) =>
  a.orderId > b.orderId ? 1 : -1
);

// [ { "id": "01JGM5ANAEG1VQVKX3CN2CVAEJ", "name": "Dr. S.S. Janaki", "metadata": { "updated_by": "demo", "created_at": "2025-01-02T18:44:28.622Z", "updated_at": "2025-01-03T17:26:03.959Z", "created_by": "demo" }, "itemPublishStatus": "PUBLISHED", "orderId": "1" }, { "id": "01JGM5AFB5Y82WD4C2HZSG8XB5", "name": "Dr. V. Yamuna Devi", "metadata": { "updated_by": "demo", "created_at": "2025-01-02T18:44:22.501Z", "updated_at": "2025-01-03T17:31:23.947Z", "created_by": "demo" }, "itemPublishStatus": "PUBLISHED", "orderId": "5", "noOfphdStudents": "4", "vacancy": "Nil" }, { "id": "01JGM5A8RWEZ970PG2Z9C6JH9G", "name": "Dr. T.V.Vasudeva", "metadata": { "updated_by": "demo", "created_at": "2025-01-02T18:44:15.773Z", "updated_at": "2025-01-03T17:26:22.589Z", "created_by": "demo" }, "itemPublishStatus": "PUBLISHED", "orderId": "4" }, { "id": "01JGM59Y2WXMCV09HDX88Y0REV", "name": "Dr. K.S.Balasubramanian", "metadata": { "updated_by": "demo", "created_at": "2025-01-02T18:44:04.828Z", "updated_at": "2025-01-03T17:26:15.959Z", "created_by": "demo" }, "itemPublishStatus": "PUBLISHED", "orderId": "3" }, { "id": "01JGM59EZNX0HKB372GKYX07G9", "name": "Dr. V. Kameswari", "metadata": { "updated_by": "demo", "created_at": "2025-01-02T18:43:49.365Z", "updated_at": "2025-01-03T17:26:09.718Z", "created_by": "demo" }, "itemPublishStatus": "PUBLISHED", "orderId": "2" } ]
</script>

<style>
/*style table header and add bg color to alternate rows*/

/*thead {
  background-color: #ebeeeb;
  color: #0a160f;
  font-weight: bold !important;
  font-size: 16px;
}*/

.v-table thead tr th {
  background-color: #09341c !important;
  color: #fff !important;
  font-weight: bold !important;
  font-size: 16px !important;
}

.v-table tbody tr:nth-child(even) {
  background-color: #fff !important;
}

.v-table tbody tr:nth-child(odd) {
  background-color: #f4f7f4 !important;
}
</style>
