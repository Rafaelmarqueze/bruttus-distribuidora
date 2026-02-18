import styled from 'styled-components'

export const ProductsSection = styled.section`
  padding: ${({ theme }) => theme.spacing.xl} 0;
  background: ${({ theme }) => theme.colors.graydark};

  h2 {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 1rem;
    color: white;

    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      font-size: 2rem;
    }
  }

  p {
    color: #6B4F3F;
  }
`

export const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`

export const ProductCard = styled.div`
  background: ${({ theme }) => theme.colors.lightGray};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: 8px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.secondary};
  }
`