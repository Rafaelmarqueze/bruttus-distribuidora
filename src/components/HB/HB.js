"use client";
import {
  CommitmentSection,
  CommitmentGrid,
  CommitmentItem,
  Divider
} from './styles';

export default function Commitment() {
  return (
    <CommitmentSection id="sobre">
      <div className="container">
        <h2>
          NOSSA HISTÓRIA É FORJADA NA <span>QUALIDADE</span>.
        </h2>

        <p>
          A <span>Bruttus Distribuidora</span> nasceu da paixão por hambúrgueres
          perfeitos. Entendemos que a alma de uma hamburgueria de sucesso está na
          qualidade da carne. Por isso, nossa missão é entregar mais do que um
          produto: entregamos a base para a excelência do seu negócio.
        </p>

        <p>
          Desde o início, nosso compromisso é com a seleção rigorosa das melhores
          carnes e a criação de blends que proporcionam sabor, suculência e uma
          experiência inesquecível para o seu cliente. Somos mais que um
          fornecedor; somos o parceiro estratégico que sua hamburgueria...
        </p>

        <Divider />
      </div>
    </CommitmentSection>
  );
}
