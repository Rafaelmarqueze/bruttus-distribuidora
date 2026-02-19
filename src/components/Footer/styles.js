import styled from "styled-components"

export const FooterContainer = styled.footer`
  background-color: #520109;
  color: ${({ theme }) => theme.colors.white};

  padding: ${({ theme }) => theme.spacing.xl} 0
    ${({ theme }) => theme.spacing.md};
`

export const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  margin-bottom: ${({ theme }) => theme.spacing.lg};

  .top {
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-bottom: 1rem;
  }

  .socials {
    display: flex;
    gap: 0.9rem;
    align-items: center;
  }

  .socials a {
    color: white;
    opacity: 0.95;
    transition: 0.2s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .socials a:hover {
    color: #fb2c36;
    transform: translateY(-3px);
  }

  .contacts {
    text-align: center;
    opacity: 0.95;
    margin-bottom: 1rem;
    line-height: 1.4;
  }

  .addresses {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.2rem;
    width: 100%;
    max-width: 980px;
    text-align: left;
  }

  .addr h4 {
    margin: 0 0 0.25rem 0;
    font-size: 0.95rem;
  }

  .addr p {
    margin: 0;
    opacity: 0.95;
    font-size: 0.95rem;
  }

  img {
    object-fit: contain;
  }

  @media (max-width: 900px) {
    .top { gap: 1rem; }
    .addresses { grid-template-columns: 1fr; }
  }

`
export const Copyright = styled.div`
  text-align: center;
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid rgba(255, 255, 255, 0.15);

  opacity: 0.7;
  font-size: 0.875rem;
`


