import styled from 'styled-components'

export const CommitmentSection = styled.section`
  padding: ${({ theme }) => theme.spacing.xl} 0;
  background: ${({ theme }) => theme.colors.white};

  h2 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
    max-width: 900px;

    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      font-size: 2rem;
    }
  }

  > p {
    font-size: 1.125rem;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    max-width: 800px;
  }
`

export const CommitmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`

export const CommitmentItem = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border-left: 4px solid ${({ theme }) => theme.colors.primary};

  h3 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.secondary};
  }

  p {
    color: ${({ theme }) => theme.colors.gray};
    line-height: 1.6;
  }
`