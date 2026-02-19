"use client";

import {
  CommitmentSection,
  CommitmentWrapper,
  CommitmentContent,
  CommitmentCards,
  CommitmentCard,
  CommitmentImage,
  IconCircle,
} from "./styles"
import Image from "next/image"

export default function Commitment() {
  return (
    <CommitmentSection id="qualidade">
      <div className="container">
        <CommitmentWrapper>

          <CommitmentContent>
            <h2>
              COMPROMISSO COM A EXCELÊNCIA, DO{" "}
              <span>FRIGORÍFICO</span> À SUA CHAPA.
            </h2>

            <p>
              Nossa qualidade não é um acaso. Contamos com uma infraestrutura
              moderna e seguimos os mais rigorosos padrões de segurança alimentar,
              com certificações que nos permitem atender com excelência em todo o
              território nacional.
            </p>

            <CommitmentCards>
              
              <CommitmentCard>
                <IconCircle />
                <div>
                  <h3>SELEÇÃO RIGOROSA</h3>
                  <p>Apenas as melhores peças de carne entram em nossos blends.</p>
                </div>
              </CommitmentCard>

              <CommitmentCard>
                <IconCircle />
                <div>
                  <h3>TECNOLOGIA DE PONTA</h3>
                  <p>
                    Equipamentos modernos que garantem a segurança e a qualidade
                    do produto final.
                  </p>
                </div>
              </CommitmentCard>

              <CommitmentCard>
                <IconCircle />
                <div>
                  <h3>LOGÍSTICA EFICIENTE</h3>
                  <p>
                    Entrega rápida e segura, garantindo que o frescor chegue
                    intacto à sua hamburgueria.
                  </p>
                </div>
              </CommitmentCard>

            </CommitmentCards>
          </CommitmentContent>

          <CommitmentImage>
            <Image src="/images/burger.png" width={300} height={300} alt="hamburguer" />
          </CommitmentImage>

        </CommitmentWrapper>
      </div>
    </CommitmentSection>
  )
}
