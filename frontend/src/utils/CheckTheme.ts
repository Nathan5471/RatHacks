const checkTheme = (theme: string, desiredTheme: string, string: string) => {
  if (theme === desiredTheme) {
    return string;
  } else {
    return "";
  }
};

export default checkTheme;
