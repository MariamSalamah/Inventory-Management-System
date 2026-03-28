export default class Validation {
  static Empty(value) {
    const val = value.trim();

    if (val !== "") {
      return {
        message: "Looks good!",
        isValid: true,
      };
    } else {
      return {
        message: "Input can't be empty",
        isValid: false,
      };
    }
  }
  static Email(value) {
    const val = value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!this.Empty(val).isValid) return this.Empty(val);

    if (emailRegex.test(val)) {
      return {
        message: "Looks good!",
        isValid: true,
      };
    } else {
      return {
        message: "Enter valid email",
        isValid: false,
      };
    }
  }

  static Text(value) {
    const val = value.trim();

    if (!this.Empty(val).isValid) return this.Empty(val);

    if (isNaN(Number(val)) && val.length > 3) {
      return {
        message: "Looks good!",
        isValid: true,
      };
    } else {
      return {
        message: "Must be more than 3 characters and not a number",
        isValid: false,
      };
    }
  }

  static Phone(value) {
    const val = value.trim();

    if (!this.Empty(val).isValid) return this.Empty(val);

    const phoneRegex = /^(01[0-2,5]{1}[0-9]{8}|\+201[0-2,5]{1}[0-9]{8})$/;

    if (phoneRegex.test(val)) {
      return {
        message: "Looks good!",
        isValid: true,
      };
    } else {
      return {
        message: "Enter valid Egyptian phone number",
        isValid: false,
      };
    }
  }
}
