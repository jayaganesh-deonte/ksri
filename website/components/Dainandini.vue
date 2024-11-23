<template>
  <v-card elevation="0" rounded="0" color="primary" class="pa-4">
    <v-row>
      <v-col cols="12" sm="12" md="12" lg="4">
        <v-list-item>
          <template v-slot:prepend>
            <v-img
              src="/img/icons/newspaper-icon.png"
              width="50"
              height="50"
              fit
            ></v-img>
          </template>
          <div class="text-h4 ml-4 defaultFont">Dainandini</div>
        </v-list-item>
        <audio controls>
          <source
            src="https://d30y75l38k1y9.cloudfront.net/upload/media/mk-dainandini-2-11-24.mp3"
          />
        </audio>
      </v-col>
      <v-col
        class="text-h6 defaultFont borderLeft pa-4"
        cols="12"
        sm="12"
        md="12"
        lg="8"
      >
        <div>
          अनार्यमार्यवृत्तेन सत्येनानृतवादितम्।
          <br />
          रिपुमप्युपकारेण वशीकुर्वन्ति साधव:॥
        </div>
        <div>
          Good people win over the bad souls by their good conduct; untruthful
          with truth and even the enemies by favouring them.
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped>
.borderLeft {
  position: relative;
}

.borderLeft::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 70%;
  border-left: 2px solid #bf641f;
}
</style>
