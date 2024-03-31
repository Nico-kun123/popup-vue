<script>
import { ref } from "vue";

export default {
  data() {
    return {
      form: {
        email: ref(""),
        password: ref(""),
        phone: ref(""),
        sex: ref("Мужчина"),
        sms: ref(false),
      },
      popupHidden: ref(true), // скрытие popup + показ кнопки "начать" и наоборот
      darkScreen: ref(false), // потемнение экрана
      jsonResult: ref(""),
    };
  },
  methods: {
    /**
     * Обработка submit у формы.
     * @param {*} event событие "click"
     */
    async sendForm(event) {
      event.preventDefault();
      // Если все обязательные поля заполнены
      if (await this.formValidation()) {
        this.closeForm(); // Закрываем popup

        // Формируем JSON
        const json = JSON.stringify(this.form, null, 4);

        this.emptyValues();

        this.jsonResult = json;
      }
    },
    /**
     * Простая валидация входных данных с помощью регулярных выражений:
     *
     * - Поля должны быть заполнены: Электронная почта, Пароль и Телефон;
     * - Проверка электронной почты;
     * - Длина пароля = как минимум 10 символов;
     * - Пароль должен содержать как минимум: 1 букву в верхнем регистре, 1 цифру, 1 особый символ. Можно использовать и русские, и английские буквы;
     * - Проверка номера телефона (длина, символы в записи номера и тп).
     * 
     * @returns "true", если все поля формы прошли валидацию. Иначе "false"
     */
    async formValidation() {
      const { email, password, phone } = this.form;
      if (email.length == 0 || password.length == 0 || phone.length == 0) {
        alert("❌Заполните все поля: Электронная почта, Пароль и Телефон!");
        return false;
      }
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        alert("❌Некорректный адрес электронной почты!");
        return false;
      }
      if (password.length < 10) {
        alert("❌Пароль должен содержать как минимум 10 символов!");
        return false;
      }
      if (
        !/^(?=.*\d)(?=.*[a-zA-Zа-яА-Я])(?=.*[!@#$%^&*()_+{}|:"<>?[\];',./]).{10,}$/.test(
          password
        )
      ) {
        alert(
          "❌Пароль должен содержать как минимум: 1 букву в верхнем регистре, 1 цифру, 1 особый символ!"
        );
        return false;
      }
      if (
        !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone)
      ) {
        alert("❌Некорректный номер телефона!");
        return false;
      }
      alert("✅Валидация прошла успешно!");
      return true;
    },
    /**
     * Показ popup, затемнение экрана.
     */
    toggle() {
      this.popupHidden = !this.popupHidden;
      if (!this.popupHidden) {
        this.darkScreen = true;
      }
    },
    /**
     * Закрытие popup при нажатии на поле вне popup. Очистка заполненных полей формы.
     */
    closePopup() {
      if (!this.popupHidden) {
        this.closeForm();
        this.emptyValues();
      }
    },
    /**
     * Убирает popup и погашенный экран.
     */
    closeForm() {
      this.popupHidden = true;
      this.darkScreen = false;
    },
    /**
     * Обнуляет значения полей формы.
     */
    emptyValues() {
      this.form.email = "";
      this.form.password = "";
      this.form.phone = "";
      this.form.sex = "Мужчина";
      this.form.sms = false;
      this.popupHidden = true;
      this.jsonResult = "";
    },
  },
};
</script>

<template>
  <div
    class="container"
    :class="{ dark: this.darkScreen, container: !this.darkScreen }"
    @click="closePopup"
  >
    <div
      class="popup"
      :class="{ hide: this.popupHidden, show: !this.popupHidden }"
      @click.stop
    >
      <form @submit.prevent="sendForm">
        <h1 id="title">Форма</h1>
        <br />

        <div class="flexBox">
          <div class="flexBox field">
            <label for="userEmail">*Электронная почта:</label>
            <input
              v-model="form.email"
              id="userEmail"
              class="forma"
              type="text"
              placeholder="Введите почту"
              name="email"
              autocomplete="email"
            />
          </div>

          <div class="flexBox field">
            <label for="userPassword">*Пароль:</label>
            <input
              v-model="form.password"
              id="userPassword"
              class="forma"
              type="password"
              placeholder="Введите пароль"
              name="psw"
            />
          </div>

          <div class="flexBox field">
            <label for="userPhone">*Телефон:</label>
            <input
              v-model="form.phone"
              id="userPhone"
              class="forma"
              type="number"
              placeholder="79121234567"
              name="phone"
              autocomplete="mobile"
            />
          </div>
          <div class="flexBox field">
            <label for="userSex">Пол:</label>
            <select v-model="form.sex" class="forma" id="userSex">
              <option value="Мужчина">Мужчина</option>
              <option value="Женщина">Женщина</option>
              <option value="Другой">Другой</option>
            </select>
          </div>
          <div>
            <label for="userSms">Отправить SMS? </label>

            <input
              v-model="form.sms"
              type="checkbox"
              id="userSms"
              class="forma"
              name="sms"
            />
            <label for="userSms"> да</label>
          </div>
        </div>

        <br />
        <div class="btn wrapper">
          <button type="submit" class="btn" @click="sendForm">Отправить</button>
          <button type="button" class="btn cancel" @click="closeForm">
            Закрыть
          </button>
        </div>
      </form>
    </div>
    <button
      :class="{ hide: !this.popupHidden, show: this.popupHidden }"
      id="popup__toggle"
      @click.stop="toggle"
    >
      Начать
    </button>
    <br />
    <div class="formResults">{{ jsonResult }}</div>
  </div>
</template>

<style>
label {
  font-weight: bold;
}
.container {
  height: 100vh;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  margin: 0;
  z-index: 2;
}
.dark {
  background-color: hsla(0, 0%, 0%, 0.5);
}
.popup {
  max-width: 500px;
  min-width: 250px;
  border: 3px double black;
  background: white;
  margin: auto;
  padding: 1em;
  z-index: 5;
}
#title {
  text-align: center;
}
.formResults {
  background-color: aqua;
  -ms-flex-item-align: center;
  -ms-grid-row-align: center;
  align-self: center;
  width: auto;
  font-weight: bold;
  padding: auto;
}
.wrapper {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;

  -webkit-box-pack: center;

  -ms-flex-pack: center;

  justify-content: center;
  -ms-flex-item-align: center;
  -ms-grid-row-align: center;
  align-self: center;
}

@media (min-width: 320px) {
  .flexBox {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
  }

  .wrapper {
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
  }
  .btn {
    width: 100%;
    margin-bottom: calc(var(--elem-margin) / 2);
  }
  .btn:last-child {
    margin-bottom: 0;
  }
}

@media (min-width: 580px) {
  .flexBox {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    -webkit-box-flex: 2;
    -ms-flex-positive: 2;
    flex-grow: 2;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
  }

  label {
    width: 100%;
  }
  .btn {
    padding: 5px;
    width: -webkit-max-content;
    width: -moz-max-content;
    width: max-content;
    width: 200px;
    -ms-flex-item-align: baseline;
    align-self: baseline;
    font-size: medium;
    margin-bottom: 0;
  }
  .wrapper {
    -webkit-box-pack: space-evenly;
    -ms-flex-pack: space-evenly;
    justify-content: space-evenly;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    width: 100%;
  }
  .field {
    width: 50%;
    height: -webkit-fit-content;
    height: -moz-fit-content;
    height: fit-content;
    -ms-flex-item-align: center;
    -ms-grid-row-align: center;
    align-self: center;
  }

  input[type="text"],
  input[type="password"],
  input[type="number"] {
    width: 100%;
  }

  select {
    width: -webkit-min-content;
    width: -moz-min-content;
    width: min-content;
  }
}
</style>