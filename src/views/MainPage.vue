<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Modusplus Талоны</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Modusplus Талоны</ion-title>
        </ion-toolbar>
      </ion-header>
      <div id="container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Отправка талона</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-input
              v-model="description"
              type="text"
              placeholder="Введите описание проблемы"
            ></ion-input>
            <ion-card-title>Выберите время записи:</ion-card-title>
            <div v-for="ticket in tickets" :key="ticket.id">
              <ion-chip
                :disabled="!!ticket.applicationId"
                color="danger"
                id="present-alert"
                @click="addApplication(ticket)"
                >{{
                  ticket.date.toString().split("T")[0].replaceAll("-", " ") +
                  " " +
                  ticket.date.toString().split("T")[1].split(".")[0]
                }}
              </ion-chip>
            </div>
            <ion-alert
              :is-open="isAlertOpen"
              header="Ваша заявка в обработке"
              :buttons="alertButtons"
              @didDismiss="isAlertOpen = false"
            ></ion-alert>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
    <ion-footer>
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-button tab="home">
              <ion-label>Записаться</ion-label>
            </ion-button>
          </ion-col>
          <ion-col>
            <ion-button tab="radio">
              <ion-label>Мои записи</ion-label>
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { Ticket, getTickets } from "@/api/tickets";
import { accessToken } from "@/utils";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonChip,
  IonInput,
  IonAlert,
  IonCol,
  IonGrid,
  IonRow,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/vue";
import { onMounted, ref, Ref } from "vue";
import { addApplication as addApplicationApi } from "@/api/applications";

const alertButtons = ["Ок"];

const tickets: Ref<Ticket[]> = ref([]);
const description: Ref<string> = ref("");
const isAlertOpen: Ref<boolean> = ref(true);

onMounted(async () => {
  tickets.value = await getTickets(accessToken.value);
});

const addApplication = async (ticket: Ticket) => {
  console.log(description.value);
  if (description.value === "") return;
  await addApplicationApi(description.value, ticket, accessToken.value);
  tickets.value = await getTickets(accessToken.value);
  description.value = "";
  isAlertOpen.value = true;
};
</script>

<style scoped>
ion-col {
  text-align: center;
}

#container {
  text-align: center;

  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;

  color: #8c8c8c;

  margin: 0;
}

#container a {
  text-decoration: none;
}

.mg-10 {
  margin: 10px;
}
</style>
