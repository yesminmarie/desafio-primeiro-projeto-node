import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}
class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    // não permitirá que uma transação do tipo outcome extrapole
    // o valor total que o usuário tem em caixa
    const totalIncome = this.transactionsRepository.reduce(
      (total: number, transaction: Transaction) => {
        if (transaction.type === 'income') return total + transaction.value;
        return total;
      },
      0,
    );

    const totalOutcome = this.transactionsRepository.reduce(
      (total: number, transaction: Transaction) => {
        if (transaction.type === 'outcome') return total + transaction.value;
      },
      0,
    );
    if (totalOutcome > totalIncome) {
      throw Error(`The outcome transaction doesn't have a valid balance`);
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
