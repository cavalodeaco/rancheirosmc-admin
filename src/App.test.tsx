import mockMatchMedia from "./mocks/matchMedia.mock";
import { render } from "@testing-library/react";
import App from "./App";

describe("the App component", () => {

  it("sets document title", () => {
    mockMatchMedia();
    render(<App />);
    const title = document.title;
    expect(title).toBe("PPV Admin");
  });

  it("set theme to dark", () => {
    mockMatchMedia(true); // true => dark
    render(<App />);
    expect(window.getComputedStyle(document.body).backgroundColor).toBe(
      "rgb(26, 27, 30)"
    );
  });

  it("set theme to light", () => {
    mockMatchMedia(false); // false => light
    render(<App />);
    expect(window.getComputedStyle(document.body).backgroundColor).toBe(
      "rgb(255, 255, 255)"
    );
  });
});
