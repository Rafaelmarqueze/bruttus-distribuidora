import styled from 'styled-components'

export const DigitalMenuSection = styled.section`
  padding: ${({ theme }) => theme.spacing.xl} 0;
  background: ${({ theme }) => theme.colors.dark};
  color: ${({ theme }) => theme.colors.white};
`

export const ContentWrapper = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto;

  h2 {
    font-size: 3rem;
    font-weight: 800;
    margin: ${({ theme }) => theme.spacing.md} 0;
    line-height: 1.2;

    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      font-size: 2rem;
    }

    span {
      color: ${({ theme }) => theme.colors.primary};
      display: block;
    }
  }

  .highlight-box {
    background: rgba(255,255,255,0.1);
    padding: ${({ theme }) => theme.spacing.lg};
    border-radius: 8px;
    margin: ${({ theme }) => theme.spacing.lg} 0;

    p {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      
      @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
        font-size: 1.25rem;
      }
    }

    strong {
      font-size: 2rem;
      color: ${({ theme }) => theme.colors.primary};
      display: block;

      @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
        font-size: 1.5rem;
      }
    }
  }

  .partnership {
    margin-top: ${({ theme }) => theme.spacing.xl};
    padding-top: ${({ theme }) => theme.spacing.lg};
    border-top: 1px solid rgba(255,255,255,0.1);

    p {
      margin-bottom: 0.5rem;
      opacity: 0.8;
    }

    span {
      font-size: 1.5rem;
      font-weight: 700;
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`

export const Highlight = styled.span`
  display: inline-block;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.dark};
  font-weight: 700;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 1px;
`

export const CTALink = styled.a`
  display: inline-block;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.dark};
  font-weight: 700;
  padding: 1rem 3rem;
  border-radius: 4px;
  font-size: 1.25rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.white};
    transform: translateY(-2px);
  }
`