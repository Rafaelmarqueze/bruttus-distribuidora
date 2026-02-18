import styled from 'styled-components'

export const FooterContainer = styled.footer`
  background-color: #520109;
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xl} 0 ${({ theme }) => theme.spacing.md};
`

export const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    text-align: center;
  }

  h4 {
    font-size: 1.125rem;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.primary};
  }

  p {
    opacity: 0.8;
    line-height: 1.6;
  }

  ul {
    li {
      margin-bottom: 0.5rem;

      a {
        opacity: 0.8;
        transition: opacity 0.3s ease;

        &:hover {
          opacity: 1;
          color: ${({ theme }) => theme.colors.primary};
        }
      }
    }
  }
`

export const Copyright = styled.div`
  text-align: center;
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid rgba(255,255,255,0.1);
  opacity: 0.6;
  font-size: 0.875rem;
`