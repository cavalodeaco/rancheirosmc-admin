import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuthenticationForm from ".";

describe("the AuthenticationForm component", () => {
  it("alerts invalid field values", async () => {
    render(<AuthenticationForm />);
    await userEvent.click(
      screen.getByRole("button", {
        name: /entrar/i,
      })
    );
    expect(
      screen.getByText(/informe seu endereço de e-mail/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Sua chave de acesso possui pelo menos 6 caracteres/i)
    ).toBeInTheDocument();
  });

  it("accepts valid field values", async () => {
    render(<AuthenticationForm />);
    await userEvent.type(
      screen.getByRole("textbox", {
        name: /e-mail/i,
      }),
      "jackson.teller@gmail.com"
    );
    await userEvent.type(screen.getByLabelText(/chave de acesso/i), "YHC4xK92");

    await userEvent.click(
      screen.getByRole("button", {
        name: /entrar/i,
      })
    );
    expect(
      screen.queryByText(/informe seu endereço de e-mail/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Sua chave de acesso possui pelo menos 6 caracteres/i)
    ).not.toBeInTheDocument();
  });
});
