import styled from 'styled-components';

export const ProductsSection = styled.section`
  padding: ${({ theme }) => theme.spacing.xl} 0;
  background: ${({ theme }) => theme.colors.graydark};

  display: flex;
  justify-content: center;

  .container {
    width: 100%;
    max-width: 900px; /* 🔥 CENTRALIZA O BLOCO */
    margin: 0 auto;

    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  h2 {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 1rem;
    color: white;
    line-height: 1.2;

    span {
      color: #FB2C36;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      font-size: 2rem;
    }
  }

  p {
    color: rgba(255, 255, 255, 0.8);
    max-width: 760px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

export const ProductsGrid = styled.div`
  width: 100%;
  max-width: 1100px;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 3rem;
  margin: 4rem auto 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

export const ProductCard = styled.div`
  background: #1c1c1c;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-6px);
  }

  .image {
    height: 460px;
    background-size: cover;
    background-position: center;
  }

.image.molded {
  background-image: url("/images/imagemolded.png");
}

.image.molded2 {
  background-image: url("/images/imagemolded2.jpeg");
}

.image.blends {
  background-image: url("/images/imageblends.png");
}


  .content {
    padding: 2rem;
    text-align: center;
  }

  h3 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: white;
    letter-spacing: 0.5px;
  }

  p {
    color: rgba(255, 255, 255, 0.75);
    line-height: 1.6;
    font-size: 0.95rem;
    max-width: 420px;
    margin: 0 auto;
  }
`;
