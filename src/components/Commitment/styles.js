import styled from "styled-components"

export const CommitmentSection = styled.section`
  padding: 100px 0;
  background: #fff;
`

export const CommitmentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  align-items: center;
  gap: 60px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const CommitmentContent = styled.div`
  h2 {
    font-size: 2.6rem;
    font-weight: 800;
    line-height: 1.2;
    max-width: 520px;

    span {
      color: #b30000;
    }
  }

  p {
    margin-top: 18px;
    font-size: 1.05rem;
    color: #555;
    line-height: 1.6;
    max-width: 520px;
  }
`

export const CommitmentCards = styled.div`
  margin-top: 35px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`

export const CommitmentCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;

  padding: 18px 20px;
  border-radius: 12px;
  background: #f7f7f7;

  h3 {
    font-size: 0.95rem;
    font-weight: 800;
    margin-bottom: 4px;
    text-transform: uppercase;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    color: #666;
    line-height: 1.4;
  }
`

export const IconCircle = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2px solid #b30000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:after {
    content: "✓";
    font-size: 14px;
    font-weight: bold;
    color: #b30000;
  }
`

export const CommitmentImage = styled.div`
  width: 100%;
  border-radius: 20px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 20px;
  }
`
