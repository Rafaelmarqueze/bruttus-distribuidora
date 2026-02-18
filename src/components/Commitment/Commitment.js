import { CommitmentSection, CommitmentGrid, CommitmentItem } from './styles'

export default function Commitment() {
  return (
    <CommitmentSection id="qualidade">
      <div className="container">
        <h2>COMPROMISSO COM A EXCELÊNCIA, DO FRIGORÍFICO À SUA CHAPA</h2>
        <p>Nossa qualidade não é um acaso. Contamos com uma infraestrutura moderna e seguimos os mais rigorosos padrões de segurança alimentar.</p>
        
        <CommitmentGrid>
          <CommitmentItem>
            <h3>SELEÇÃO RIGOROSA</h3>
            <p>Apenas as melhores peças de carne entram em nossos blends.</p>
          </CommitmentItem>

          <CommitmentItem>
            <h3>TECNOLOGIA DE PONTA</h3>
            <p>Equipamentos modernos que garantem a segurança e a qualidade do produto final.</p>
          </CommitmentItem>

          <CommitmentItem>
            <h3>LOGÍSTICA EFICIENTE</h3>
            <p>Entrega rápida e segura, garantindo que o frescor chegue intacto à sua hamburgueria.</p>
          </CommitmentItem>
        </CommitmentGrid>
      </div>
    </CommitmentSection>
  )
}