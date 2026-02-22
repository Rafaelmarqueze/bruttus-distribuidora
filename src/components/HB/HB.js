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
          ENTREGA GARANTIDA DE <span>DOMINGO A DOMINGO</span>.
        </h2>

        <p>
          Porque seu cliente não espera <span>e você não pode ficar na mão.</span>
          Nós da Bruttus entendemos como funciona a operação. Em pleno fim 
          de semana você vende muito <span>hamburgueria cheia, fila andando</span> e é 
          exatamente nessa hora que a carne acaba e o fornecedor some. 
          Por isso entregamos 7 dias por semana, inclusive no domingo, para você 
          nunca parar sua operação por falta de produto.
          Seu fim de semana vai ser de lucro. Não de aperto.
        </p>

        <p>
          <b>Clique no botão do WhatsApp e fale agora com um consultor!</b>
        </p>

        <Divider />
      </div>
    </CommitmentSection>
  );
}
