import styled from 'styled-components';

export const CommitmentSection = styled.section`
  padding: ${({ theme }) => theme.spacing.xl} 0;
  background: ${({ theme }) => theme.colors.white};

  display: flex;
  justify-content: center;

  .container {
    width: 100%;
    max-width: 900px; /* 🔥 largura correta no desktop */
    margin: 0 auto;

    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  h2 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 1rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.125rem;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    max-width: 800px;
    line-height: 1.6;
  }

  span {
    color: #FB2C36;
  }
`;

export const CommitmentGrid = styled.div`
  width: 100%;
  max-width: 1100px;
  margin-top: ${({ theme }) => theme.spacing.xl};

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

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
`;

export const Divider = styled.div`
  width: 80px;
  height: 3px;
  background: #FB2C36;
  margin: 3rem auto 0;
`;
