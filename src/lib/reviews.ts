export type ReviewText = { author: string; text: string; likes?: number };

const CHURRASQUEIRA: ReviewText[] = [
  { author: "Ana Paula R.", text: "Chegou muito bem embalada e montei em poucos minutos, sem ferramenta nenhuma. A bacia esmaltada é bem funda, segura bastante carvão e não deforma com o calor. Já fiz três churrascos e a brasa mantém a temperatura por bastante tempo, sem precisar ficar abanando o tempo todo. Limpeza é simples, só esperar esfriar e lavar. Custo-benefício excelente.", likes: 362 },
  { author: "Rodrigo Santos", text: "Comprei pra usar na varanda de casa e superou o que eu esperava. A grelha é firme, não entorta com o peso da carne e a altura regulável ajuda muito a controlar o ponto. O acabamento esmaltado não descascou nenhum pedaço mesmo depois de vários usos. Entrega antes do prazo e veio tudo certinho conforme o anúncio.", likes: 289 },
  { author: "Carla Mendes", text: "Presente pro meu marido e ele amou. É leve o suficiente pra levar pra chácara, mas passa sensação de resistente. Cabe carne pra umas oito pessoas tranquilo. O único cuidado é secar bem depois de lavar pra conservar o esmalte. Chegou rápido e bem protegida na caixa.", likes: 244 },
  { author: "Fernando Lima", text: "Exatamente como descrito no anúncio, sem surpresa nenhuma. Acende fácil, a brasa distribui bem por toda a bacia e não solta fumaça em excesso. Já usei em dia de vento e continuou funcionando bem. Guardar é simples porque ocupa pouco espaço. Vale cada centavo pelo preço que paguei.", likes: 198 },
  { author: "Juliana Alves", text: "Melhor compra que fiz esse ano. Nunca tinha feito churrasco sozinha e consegui de primeira, é bem prática. Dica: forre com papel alumínio que fica ainda mais fácil de limpar depois. Chegou lacrada, bem embalada, e o atendimento da loja respondeu rápido quando perguntei sobre o tamanho.", likes: 173 },
  { author: "Marcelo Torres", text: "Já tive churrasqueira mais cara e essa não fica devendo nada pro uso doméstico. Estrutura firme, não balança e o esmalte segura bem o calor. Comprei na promoção e valeu muito a pena, se estiver na dúvida pode comprar tranquilo.", likes: 156 },
];

const CADEIRA: ReviewText[] = [
  { author: "Ana Paula R.", text: "Confesso que fiquei com o pé atrás por causa do preço, mas a cadeira chegou em 4 dias, bem embalada e sem nenhum arranhão. A estrutura de aço é firme, não balança e o tecido é grosso, não afunda quando sento. Já levei pra praia duas vezes e aguentou areia, sol e água salgada numa boa. Dobra fácil e cabe no porta-malas sem ocupar espaço.", likes: 362 },
  { author: "Rodrigo Santos", text: "Comprei duas pra usar no quintal e viraram as cadeiras favoritas lá de casa. Suportam bem meu peso (95kg) sem ranger nada, e o tecido não desbotou depois de várias horas de sol. O sistema de dobrar é simples e não prende o dedo. Entrega antes do prazo, com nota fiscal. Recomendo demais.", likes: 289 },
  { author: "Carla Mendes", text: "Presente pro meu marido e ele amou. O que mais chamou atenção foi o peso: é leve pra carregar até a areia sem cansar o braço, mas parece resistente. As cores são exatamente como nas fotos. Chegou rapidinho e bem protegida. Segunda compra que faço na loja e nunca tive problema.", likes: 244 },
  { author: "Fernando Lima", text: "Produto exatamente como descrito, sem surpresa nenhuma. Usei em camping por três dias seguidos, chuva e sol, e continuou firme. A pintura da estrutura não soltou e as costuras do tecido estão intactas. Guardar é fácil porque dobra bem fininha. Entrega pelo FULL chegou dois dias antes do previsto.", likes: 198 },
  { author: "Juliana Alves", text: "Melhor compra que fiz esse ano, com sinceridade. Levei pra praia com as crianças e foi ótimo: leve, estável na areia e confortável mesmo depois de ficar sentada bastante tempo. Uma dica: lave com água doce depois da praia que conserva muito mais. Chegou lacrada e com garantia.", likes: 173 },
  { author: "Marcelo Torres", text: "Já tive cadeira de praia mais cara e essa não fica devendo em nada. Aço reforçado, tecido bom e a dobra é firme, não fecha sozinha. Comprei aproveitando a promoção e valeu muito a pena, se estiver na dúvida pode comprar tranquilo que não vai se arrepender.", likes: 156 },
];

const ESCADA: ReviewText[] = [
  { author: "Ana Paula R.", text: "Fiquei com o pé atrás por causa do preço, mas a escada chegou em 4 dias, bem embalada e sem nenhum amassado. O alumínio é firme, não balança quando subo e os degraus antiderrapantes dão bastante segurança. Uso pra alcançar armário alto e trocar lâmpada e nunca senti instabilidade. Dobrada ocupa quase nada atrás da porta.", likes: 362 },
  { author: "Rodrigo Santos", text: "Trabalho com manutenção e comprei como reserva, mas virou a que mais uso. Leve pra carregar entre serviços e aguenta meu peso sem ceder nada. A trava de abertura encaixa firme e não fecha sozinha. Veio tudo certinho conforme o anúncio, entrega antes do prazo e com nota fiscal.", likes: 289 },
  { author: "Carla Mendes", text: "Comprei pro meu marido e ele amou. O que mais chamou atenção foi o acabamento e o peso: dá pra subir e descer tranquilo e ainda assim é bem resistente. Os pés de borracha não riscam o piso e não escorregam. Chegou rapidinho e bem protegida na caixa.", likes: 244 },
  { author: "Fernando Lima", text: "Produto exatamente como descrito no anúncio. Usei pra pintar a sala inteira e ficar em cima por horas não foi problema, os degraus são largos e o pé não dói. Abre e fecha com uma mão só. A entrega pelo FULL foi surpreendentemente rápida, chegou dois dias antes. Vale cada centavo.", likes: 198 },
  { author: "Juliana Alves", text: "Melhor compra que fiz esse ano. Moro sozinha e sempre precisava pedir ajuda pra alcançar as coisas, agora resolvo tudo. É leve, consigo mover de um cômodo pro outro sem esforço. Dica: confira sempre se a trava está totalmente aberta antes de subir. Chegou lacrada e com garantia.", likes: 173 },
  { author: "Marcelo Torres", text: "Já tive escada de marca mais cara e essa não fica devendo em nada pro uso doméstico. Estrutura firme, degraus antiderrapantes e a dobra é bem feita, não empena. Comprei na promoção e valeu muito a pena, pode comprar tranquilo.", likes: 156 },
];

const ROBO: ReviewText[] = [
  { author: "Ana Paula R.", text: "Fiquei com o pé atrás por causa do preço, mas o robô chegou em 4 dias, bem embalado e sem nenhum arranhão. Configurei em cinco minutos e ele já saiu limpando a casa toda. Varre, aspira e passa pano de verdade, o pano sai molhado no ponto certo. A bateria dura o suficiente pra fazer os dois quartos e a sala numa passada só.", likes: 362 },
  { author: "Rodrigo Santos", text: "Tenho dois cachorros em casa e o pelo era um problema diário. Depois que comprei, ligo todo dia de manhã e o chão fica limpo sem eu encostar na vassoura. A sucção é boa mesmo em tapete fino e ele desvia bem dos móveis. Veio tudo certinho, entrega antes do prazo.", likes: 289 },
  { author: "Carla Mendes", text: "Comprei pra minha mãe de presente e ela amou. O que mais chamou atenção foi como é silencioso, dá pra usar enquanto assiste TV. O reservatório de água é fácil de encher e o recipiente de sujeira dá pra esvaziar sem sujar a mão. Chegou rapidinho e bem protegido.", likes: 244 },
  { author: "Fernando Lima", text: "Produto exatamente como descrito no anúncio. Passa embaixo da cama e do sofá, lugares que eu quase nunca limpava. Recarrega sozinho e volta pro lugar. Só recomendo tirar fios e cabos do chão antes de ligar. Entrega pelo FULL chegou dois dias antes do previsto. Vale cada centavo.", likes: 198 },
  { author: "Juliana Alves", text: "Melhor compra que fiz esse ano. Não entendo de tecnologia e mesmo assim consegui usar de primeira, é bem intuitivo. Uma dica: carregue completo antes do primeiro uso que a bateria rende bem mais. Chegou lacrado, com garantia e a embalagem toda reforçada.", likes: 173 },
  { author: "Marcelo Torres", text: "Já tive aspirador robô mais caro e esse não fica devendo em nada pro uso doméstico. Limpa bem, não trava e o pano encaixa firme. Comprei aproveitando a promoção e valeu muito a pena, se estiver na dúvida pode comprar tranquilo.", likes: 156 },
];

const FRITADEIRA: ReviewText[] = [
  { author: "Ana Paula R.", text: "Fiquei com o pé atrás por causa do preço, mas chegou em 4 dias, bem embalada e sem nenhum arranhão. Os 12 litros são bem maiores do que eu imaginava, faço frango inteiro tranquilo. Esquenta rápido, doura por igual e a comida fica sequinha sem óleo. Limpeza é fácil, a bandeja sai inteira.", likes: 362 },
  { author: "Rodrigo Santos", text: "Uso praticamente todo dia pra reaquecer e assar. A temperatura é constante, não queima em um lado só, e o timer desliga sozinho. Já fiz batata, pão de queijo, carne e bolo, tudo saiu bem. Veio tudo certinho conforme o anúncio, entrega antes do prazo e nota fiscal junto.", likes: 289 },
  { author: "Carla Mendes", text: "Comprei pro meu marido de presente e ele amou. O que mais chamou atenção foi o acabamento e a capacidade: cabe comida pra família toda de uma vez. O visor deixa acompanhar sem abrir a porta. Chegou rapidinho e bem protegida. Segunda compra na loja e nunca tive problema.", likes: 244 },
  { author: "Fernando Lima", text: "Produto exatamente como descrito no anúncio. Não esquenta a cozinha como o forno normal e gasta bem menos energia. Os acessórios que vêm junto cobrem quase tudo que preciso, não tive que comprar nada separado. Entrega pelo FULL chegou dois dias antes. Vale cada centavo.", likes: 198 },
  { author: "Juliana Alves", text: "Melhor compra que fiz esse ano. Não cozinho muito bem e mesmo assim acerto tudo, é bem intuitiva. Dica: deixe pré-aquecer uns 3 minutos que o resultado melhora bastante. Chegou lacrada, com garantia e a embalagem toda reforçada. Atendimento respondeu rápido sobre a voltagem.", likes: 173 },
  { author: "Marcelo Torres", text: "Já tive fritadeira de marca mais cara e essa não fica devendo em nada. Aquece rápido, mantém a temperatura e o cesto é firme. O tamanho é o grande diferencial. Comprei na promoção e valeu muito a pena, pode comprar tranquilo.", likes: 156 },
];

const PANELAS: ReviewText[] = [
  { author: "Ana Paula R.", text: "Fiquei com o pé atrás por causa do preço, mas o jogo chegou em 4 dias, muito bem embalado e sem nenhum arranhão. O antiaderente cerâmico é ótimo: fritei ovo sem óleo e não grudou nada. As panelas esquentam rápido e por igual, e o cabo não esquenta na mão. A cor baunilha é linda e as 10 peças cobrem tudo que uso no dia a dia.", likes: 362 },
  { author: "Rodrigo Santos", text: "Comprei porque meu fogão é de indução e funcionou perfeitamente, aquece rápido e mantém o calor. O fundo é grosso, não empena e não deforma. Lavar é fácil, sai tudo com uma esponja macia. Veio tudo certinho conforme o anúncio, entrega antes do prazo e com nota fiscal.", likes: 289 },
  { author: "Carla Mendes", text: "Presente pra minha mãe e ela amou. O que mais chamou atenção foi o acabamento e o peso: são leves de manusear, mas parecem bem resistentes. As tampas de vidro encaixam direitinho e dá pra acompanhar o cozimento sem abrir. Chegou rapidinho e bem protegido na caixa.", likes: 244 },
  { author: "Fernando Lima", text: "Produto exatamente como descrito no anúncio. Uso todos os dias há semanas e o antiaderente continua igual ao primeiro dia. Só recomendo usar colher de silicone pra conservar melhor e evitar lavar quente na água fria. Entrega pelo FULL chegou dois dias antes. Vale cada centavo.", likes: 198 },
  { author: "Juliana Alves", text: "Melhor compra que fiz esse ano. Troquei minhas panelas velhas por essas e a diferença na cozinha é enorme, além de ficarem lindas no fogão. Cozinha por igual, não queima o fundo do arroz. Chegou lacrado, com garantia e a embalagem toda reforçada.", likes: 173 },
  { author: "Marcelo Torres", text: "Já tive jogo de panelas de marca mais cara e esse não fica devendo em nada. Antiaderente bom, cabos firmes e serve na indução. Comprei na promoção e valeu muito a pena, se estiver na dúvida pode comprar tranquilo.", likes: 156 },
];


const GELADEIRA: ReviewText[] = [
  { author: "Ana Paula R.", text: "Confesso que fiquei receosa de comprar geladeira pela internet, mas chegou em 5 dias, embalada com muito cuidado e sem um amassado sequer. Depois de 6 horas em pé liguei e em pouco tempo já estava gelando bem. O Frost Free faz toda diferença: nunca mais precisei descongelar nada. Os 297 litros dão conta tranquilo da compra do mês de uma família de quatro pessoas.", likes: 412 },
  { author: "Rodrigo Santos", text: "Comprei pra substituir uma antiga que gastava muita energia e a diferença na conta de luz apareceu já no primeiro mês. É silenciosa, quase não escuto o motor à noite. As prateleiras são reguláveis e a porta segura garrafa de 2 litros em pé sem problema. Veio com nota fiscal e garantia da Consul.", likes: 337 },
  { author: "Carla Mendes", text: "Produto original, exatamente como no anúncio. O branco é bem bonito e não amarela. Gostei bastante da gaveta de legumes, é funda e mantém as verduras firmes por muito mais tempo. A entrega foi acompanhada pelo aplicativo e chegou antes do prazo previsto.", likes: 281 },
  { author: "Fernando Lima", text: "Geladeira excelente pelo preço que paguei. O freezer congela rápido e não forma aquela camada de gelo. Cabe em espaço pequeno, medi antes e encaixou certinho na minha cozinha. Único cuidado é deixar um vão atrás para ventilação. Recomendo sem medo.", likes: 236 },
  { author: "Juliana Alves", text: "Melhor compra do ano. Moro em apartamento e o tamanho é perfeito, não pesa visualmente na cozinha. Gela bem mesmo no calor de 38 graus daqui. O atendimento respondeu minhas dúvidas em minutos antes da compra.", likes: 194 },
  { author: "Marcelo Torres", text: "Já tive marca mais cara e essa Consul não fica devendo nada. Montagem zero, é só ligar. Iluminação interna boa e as prateleiras aguentam peso sem entortar. Comprei na promoção e valeu cada centavo.", likes: 163 },
];

const CAFETEIRA: ReviewText[] = [
  { author: "Ana Paula R.", text: "Chegou em 3 dias, muito bem embalada. É pequena e cabe em qualquer cantinho da bancada. O café sai quente, encorpado e com crema de verdade, nada a ver com cafeteira comum. Em menos de um minuto está pronto, salva demais nas manhãs corridas.", likes: 398 },
  { author: "Rodrigo Santos", text: "Uso todos os dias, às vezes três cafés seguidos, e ela não esquenta demais nem perde pressão. O reservatório sai fácil pra encher e a bandeja é regulável, dá pra usar xícara grande. Custo-benefício absurdo pelo preço que peguei na promoção.", likes: 322 },
  { author: "Carla Mendes", text: "Comprei a preta e o acabamento é lindo, parece bem mais cara do que é. Silenciosa comparada com a antiga que eu tinha. Cápsula encaixa sem forçar e o descarte é limpo. Chegou lacrada, original Três Corações, com nota fiscal.", likes: 265 },
  { author: "Fernando Lima", text: "Produto exatamente como descrito. Desliga sozinha depois de um tempo, o que me deixou mais tranquilo. Fácil de limpar, só passar um pano. Entrega antes do prazo. Presentei minha mãe com outra igual.", likes: 221 },
  { author: "Juliana Alves", text: "Melhor presente que dei pro meu marido. Ele toma café toda hora e agora não reclama mais do sabor. A escolha de voltagem no anúncio deixou tudo certo, veio 127V como pedi. Recomendo demais.", likes: 187 },
  { author: "Marcelo Torres", text: "Simples de usar, sem menu complicado: liga, coloca a cápsula e aperta. A pressão de 19 bar realmente aparece na xícara. Ocupa pouquíssimo espaço. Pode comprar tranquilo.", likes: 152 },
];

const KARCHER: ReviewText[] = [
  { author: "Ana Paula R.", text: "Chegou em 4 dias bem embalada e com todos os acessórios. Montei em cinco minutos e já lavei o carro inteiro. A pressão é forte de verdade, tira sujeira encrustada do para-choque sem esfregar. O motor a indução é bem mais silencioso do que eu esperava.", likes: 421 },
  { author: "Rodrigo Santos", text: "Lavei calçada, muro e o quintal todo com ela. A lança turbo é impressionante, tira limo e mancha antiga do cimento. Usei por mais de uma hora seguida e o motor não esquentou. Kärcher original, com nota fiscal e garantia.", likes: 356 },
  { author: "Carla Mendes", text: "Comprei pro meu marido e virou brinquedo dele no fim de semana. A lança leque é ótima pra lavar carro sem risco de danificar a pintura. Guardar é fácil porque tem enrolador de mangueira e suporte pros acessórios.", likes: 288 },
  { author: "Fernando Lima", text: "Produto exatamente como anunciado, 220V como escolhi. Pressão de 2100 PSI faz muita diferença comparado às lavadoras baratas. Só recomendo usar filtro na entrada de água pra conservar. Vale cada centavo.", likes: 240 },
  { author: "Juliana Alves", text: "Melhor compra do ano. Economizo o que gastava em lava-jato em duas lavagens. Fácil de manusear, não é pesada e o cabo tem bom comprimento. Chegou antes do prazo pelo FULL.", likes: 199 },
  { author: "Marcelo Torres", text: "Já tive outra marca e o motor a indução dessa K5 é outro nível de durabilidade. Não perde força mesmo com uso prolongado. Comprei na promoção e paguei muito menos do que na loja física.", likes: 168 },
];

const FREEZER: ReviewText[] = [
  { author: "Ana Paula R.", text: "Chegou em 5 dias, bem protegido e sem nenhum amassado. Deixei descansar 6 horas antes de ligar, como recomenda o manual, e desde então funciona perfeito. Os 201 litros cabem muito mais do que eu imaginava: carne pro mês inteiro, congelados, sorvete e ainda sobra espaço. A função 2 em 1 é o grande diferencial, deixei como freezer mas sei que posso usar de geladeira extra em festa de fim de ano.", likes: 405 },
  { author: "Rodrigo Santos", text: "Comprei pra apoiar no comércio de casa e superou as expectativas. Congela rápido, mesmo com o freezer cheio, e o controle de temperatura funciona direitinho: coloquei no médio e mantém tudo duro sem consumir muita energia. As prateleiras removíveis ajudam a organizar por tipo de alimento, não fica aquela bagunça de freezer horizontal onde tudo some no fundo.", likes: 344 },
  { author: "Carla Mendes", text: "O formato vertical é perfeito pra quem tem espaço apertado. Ocupa quase a mesma área de uma geladeira estreita e guarda muita coisa. O branco é bonito e combinou com o resto da cozinha. A trava da porta dá segurança porque tenho criança pequena em casa. Entrega dentro do prazo e produto original Philco com nota fiscal.", likes: 279 },
  { author: "Fernando Lima", text: "Produto exatamente como descrito no anúncio, voltagem 220V como escolhi. O motor é silencioso, à noite praticamente não se escuta. Fiz o teste de deixar carne por três semanas e continuou perfeita, sem queimadura de freezer. Único cuidado é não encostar totalmente na parede para não atrapalhar a ventilação.", likes: 233 },
  { author: "Juliana Alves", text: "Melhor investimento que fiz pra casa esse ano. Agora compro carne em maior quantidade quando está em promoção e economizo bastante no mercado. Fácil de limpar, as prateleiras saem inteiras. Chegou antes do prazo e o suporte da loja respondeu minhas dúvidas em poucos minutos.", likes: 196 },
  { author: "Marcelo Torres", text: "Já tinha um freezer horizontal antigo e a diferença de praticidade é enorme: neste aqui eu vejo tudo de frente, nada fica esquecido no fundo. A montagem é zero, é só posicionar, nivelar os pés e ligar. Comprei aproveitando a promoção e valeu muito a pena, recomendo sem medo.", likes: 171 },
];

const FOGAO: ReviewText[] = [
  { author: "Ana Paula R.", text: "Chegou em 4 dias, embalado com muito cuidado, sem risco nem amassado. O inox é lindo e valoriza demais a cozinha. Acendimento automático funciona de primeira em todas as bocas. A tripla chama esquenta panela grande num tempo bem menor.", likes: 388 },
  { author: "Rodrigo Santos", text: "Forno assa por igual, fiz pão e bolo e não queimou embaixo como no meu antigo. A luz interna ajuda bastante a acompanhar sem abrir a porta. Grades de ferro fundido bem firmes, panela não escorrega. Bivolt resolveu meu problema de tomada.", likes: 315 },
  { author: "Carla Mendes", text: "Produto original Brastemp, com nota fiscal e garantia. Limpeza é fácil, o inox não mancha se secar depois. O vidro duplo da porta é removível, o que facilita muito na hora de limpar gordura.", likes: 262 },
  { author: "Fernando Lima", text: "Exatamente como no anúncio. Instalei sozinho em minutos, só conectar o registro e testar. Chama azul, sem cheiro de gás. Entrega antes do prazo com rastreio pelo app. Ótimo custo-benefício.", likes: 214 },
  { author: "Juliana Alves", text: "Melhor compra do ano pra cozinha. Bonito, resistente e prático. Os botões saem para lavar, detalhe que faz diferença. Recomendo sem medo.", likes: 183 },
  { author: "Marcelo Torres", text: "Já tive fogão mais caro e esse não fica devendo nada. Estrutura firme, mesa não empena e a distribuição das bocas é bem pensada. Comprei na promoção e valeu cada centavo.", likes: 149 },
];

const BATERIA: ReviewText[] = [
  { author: "Ana Paula R.", text: "Chegou em 3 dias, muito bem embalada em caixa reforçada e com todos os selos originais da Moura. Instalei no mesmo dia e o carro pegou de primeira, sem aquele arrasto que a bateria velha fazia. Já enfrentei duas manhãs bem frias e nem sinal de fraqueza. Veio com nota fiscal e a garantia registrada no site do fabricante, o que me deixou muito mais tranquila.", likes: 417 },
  { author: "Rodrigo Santos", text: "Comprei porque na loja física estavam pedindo quase o dobro pela mesma M60GD. Produto idêntico ao que vendem lá, mesmo selo, mesma data de fabricação recente. A partida ficou visivelmente mais rápida e o som e o ar-condicionado não derrubam mais a tensão. Livre de manutenção, não precisa completar água nenhuma.", likes: 349 },
  { author: "Carla Mendes", text: "Meu carro estava falhando pra ligar de manhã e resolveu completamente. A entrega foi cuidadosa, o entregador trouxe até a porta porque é pesada. Confiro polaridade antes de comprar e veio certinha, direita, exatamente como no anúncio. Encaixou perfeito no berço sem adaptação.", likes: 286 },
  { author: "Fernando Lima", text: "Bateria original, data de fabricação bem recente, isso importa muito. Já são quatro meses de uso diário em aplicativo, ligando e desligando o motor o dia todo, e continua firme. A corrente de partida é forte mesmo com o carro parado dois dias. Excelente custo-benefício.", likes: 238 },
  { author: "Juliana Alves", text: "Melhor compra que fiz pro carro esse ano. Chegou antes do prazo, com rastreio completo pelo aplicativo. Levei num mecânico só pra conferir a instalação e ele confirmou que é original e de ótima qualidade. Recomendo demais pra quem quer economizar sem arriscar em bateria genérica.", likes: 201 },
  { author: "Marcelo Torres", text: "Já usei outras marcas mais baratas e nunca duraram mais de um ano. A Moura é outro nível de durabilidade, placas reforçadas e desempenho constante. Comprei aproveitando a promoção e valeu muito a pena, pode comprar tranquilo que é produto original.", likes: 174 },
];

const CASINHA: ReviewText[] = [
  { author: "Ana Paula R.", text: "Chegou em 4 dias, bem embalada e sem nenhuma trinca. A montagem é por encaixe, fiz sozinha em dez minutos sem ferramenta. É realmente grande, meu labrador entra e se deita esticado com folga. O plástico é grosso e não cede quando ele sobe em cima.", likes: 394 },
  { author: "Rodrigo Santos", text: "Deixo no quintal exposta ao sol e à chuva e até agora a cor vermelha não desbotou. A água escorre pelo telhado e o piso elevado mantém o interior seco. Limpeza é simples, tiro o teto e lavo com mangueira.", likes: 328 },
  { author: "Carla Mendes", text: "Tamanho N7 é enorme mesmo, cabem meus dois cães médios juntos. Chegou exatamente como no anúncio, plástico injetado firme e sem rebarba. Custo-benefício ótimo comparado às de madeira que apodrecem.", likes: 273 },
  { author: "Fernando Lima", text: "Produto conforme descrito. Leve pra mover no quintal quando preciso varrer, mas não voa com vento. Meu cachorro se adaptou no primeiro dia. Entrega antes do prazo com rastreio.", likes: 226 },
  { author: "Juliana Alves", text: "Melhor compra pro meu pet. Antes ele dormia na área e ficava com frio, agora tem cantinho próprio e protegido. Fácil de higienizar, sem cheiro. Recomendo muito.", likes: 190 },
  { author: "Marcelo Torres", text: "Bem resistente, já são meses de uso e continua como nova. O teto removível facilita muito a limpeza. Comprei na promoção e valeu cada centavo.", likes: 158 },
];

export const REVIEWS_BY_PRODUCT: Record<string, ReviewText[]> = {
  "6549324": PANELAS,
  "8198000010": CHURRASQUEIRA,
  "4986000011": CADEIRA,
  "6193000012": ESCADA,
  "1187300013": ROBO,
  "9883000014": FRITADEIRA,
  "7712000016": GELADEIRA,
  "3345000017": CAFETEIRA,
  "5521000018": KARCHER,
  "8834000019": FREEZER,
  "4407000020": FOGAO,
  "9163000021": BATERIA,
  "2278000022": CASINHA,
};
