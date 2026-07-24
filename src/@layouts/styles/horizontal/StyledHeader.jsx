import styled from "@emotion/styled";
import { horizontalLayoutClasses } from "@layouts/utils/layoutClasses";

const StyledHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 1100;

  display: flex;
  flex-direction: column;

  inline-size: 100%;
  flex-shrink: 0;

  background-color: ${({ scrolled, isBlur }) =>
    scrolled
      ? isBlur
        ? "rgb(var(--mui-palette-background-paperChannel) / 0.8)"
        : "rgb(var(--mui-palette-background-paperChannel))"
      : "rgb(var(--mui-palette-background-paperChannel))"};

  backdrop-filter: ${({ scrolled, isBlur }) =>
    scrolled && isBlur ? "blur(20px)" : "none"};

  border-bottom: ${({ skin }) =>
    skin === "bordered" ? "1px solid var(--mui-palette-divider)" : "none"};

  box-shadow: ${({ skin, scrolled }) =>
    scrolled && skin !== "bordered" ? "var(--mui-customShadows-md)" : "none"};

  transition:
    background-color 0.3s ease,
    backdrop-filter 0.3s ease,
    box-shadow 0.3s ease;

  .${horizontalLayoutClasses.navbar}, .${horizontalLayoutClasses.navigation} {
    width: 100%;
    position: relative;
  }

  ${({ overrideStyles }) => overrideStyles}
`;

export default StyledHeader;
