<template>
  <div style="background-color: white" class="d-flex flex-column align-center">
    <section-title title="KSRI Governing Body Members" />

    <div class="d-flex justify-center pa-2 ma-2">
      <v-btn
        :color="actionSection === 'Present' ? 'primary' : ''"
        rounded="pill"
        size="large"
        class="mx-2"
        :variant="actionSection === 'Present' ? 'flat' : 'outlined'"
        @click="actionSection = 'Present'"
      >
        Present
      </v-btn>
      <v-btn
        :color="actionSection === 'Past' ? 'primary' : ''"
        :variant="actionSection === 'Past' ? 'flat' : 'outlined'"
        rounded="pill"
        size="large"
        @click="actionSection = 'Past'"
      >
        Past
      </v-btn>
    </div>

    <!-- for all governing body members display heading , their name and subtitle -->
    <div v-if="actionSection === 'Present'">
      <GoverningBody
        :governingBodyMemberKeys="designations"
        :governingBodyMembers="presentGoverningBodyMembersWithDesignations"
      />
    </div>

    <div v-if="actionSection === 'Past'">
      <GoverningBody
        :governingBodyMemberKeys="pastDesignations"
        :governingBodyMembers="pastGoverningBodyMembersWithDesignations"
      />
    </div>
  </div>
</template>

<script setup>
import GoverningBody from "./GoverningBody.vue";

const actionSection = ref("Present");

const presentGoverningBodyMemberData = await queryContent(
  "governingbodymembers",
  "present"
).findOne();
const presentGoverningBodyMembers = presentGoverningBodyMemberData.body;

const designations = [
  "President",
  "Vice President",
  "Secretary",
  "Treasurer",
  "Trustees",
  "Members",
];
// create a object with designations as keys and values from presentGoverningBodyMembers as values
let presentGoverningBodyMembersWithDesignations = {};

console.log("presentGoverningBodyMembers", presentGoverningBodyMembers);

presentGoverningBodyMembers.forEach((member) => {
  designations.forEach((designation) => {
    if (member.designation === designation) {
      if (!presentGoverningBodyMembersWithDesignations[designation]) {
        presentGoverningBodyMembersWithDesignations[designation] = [];
      }
      presentGoverningBodyMembersWithDesignations[designation].push(member);
    }
  });
});

console.log(
  "presentGoverningBodyMembersWithDesignations",
  presentGoverningBodyMembersWithDesignations
);

const governingBodyMemberKeys = Object.keys(presentGoverningBodyMembers);

const pastGoverningBodyMembersData = await queryContent(
  "governingbodymembers",
  "past"
).findOne();
const pastGoverningBodyMembers = pastGoverningBodyMembersData.body;

let pastDesignations = [
  "Presidents",
  "Vice-Presidents",
  "Secretaries",
  "Treasurers",
  "Trustees",
  "Members",
];

let pastGoverningBodyMembersWithDesignations = {};

pastGoverningBodyMembers.forEach((member) => {
  pastDesignations.forEach((designation) => {
    if (member.designation === designation) {
      if (!pastGoverningBodyMembersWithDesignations[designation]) {
        pastGoverningBodyMembersWithDesignations[designation] = [];
      }
      pastGoverningBodyMembersWithDesignations[designation].push(member);
    }
  });
});

const pastGoverningBodyMemberKeys = Object.keys(pastGoverningBodyMembers);

const updateActiveSection = (section) => {
  actionSection.value = section;
};
</script>
