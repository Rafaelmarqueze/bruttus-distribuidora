import styled from "styled-components"

export const DigitalMenuSection = styled.section`
  padding: ${({ theme }) => theme.spacing.xl} 0;
  background: radial-gradient(
    circle at top,
    #8b0000 0%,
    #4a0000 60%,
    #1a0000 100%
  );
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  justify-content: center;
`

export const ContentWrapper = styled.div`
  text-align: center;
  max-width: 720px;
  margin: 0 auto;

  .subtitle {
    font-size: 1rem;
    opacity: 0.8;
    margin-bottom: 1rem;
  }

  h1 {
    font-size: 3rem;
    font-weight: 900;
    line-height: 1.1;
    margin: ${({ theme }) => theme.spacing.md} 0;

    span {
      display: block;
      color: #ffc400;
      margin-top: 0.25rem;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      font-size: 2.2rem;
    }
  }

  .muted {
    margin-top: 1.5rem;
    opacity: 0.8;
  }

  .emphasis {
    display: block;
    margin-top: 0.5rem;
    font-size: 1.2rem;
    font-weight: 800;
    letter-spacing: 1px;
  }
`

export const LogosRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;

  img {
    height: 70px;
    object-fit: contain;
  }

  span {
    font-size: 2rem;
    opacity: 0.5;
  }

  .darius {
    margin-left: 20px;
  }
  .logo {
    margin-left: 20px; 
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 1rem;

    span {
      display: none;
    }

    img {
      height: 60px;
    }
  }
`

export const Divider = styled.div`
  width: 80px;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  margin: 2rem auto;
`

export const CTAButton = styled.a`
  margin-top: 3rem;

  display: inline-flex;
  justify-content: center;
  align-items: center;

  padding: 20px 60px;
  border-radius: 999px;

  background: #ffc400;
  color: #2b0000;

  font-size: 1.15rem;
  font-weight: 900;
  letter-spacing: 1px;
  text-transform: uppercase;

  text-decoration: none;
  border: none;
  cursor: pointer;

  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);

  transition: all 0.25s ease;

  &:hover {
    transform: scale(1.05);
    background: #ffd84d;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    padding: 18px 20px;
    font-size: 1rem;
  }
`
