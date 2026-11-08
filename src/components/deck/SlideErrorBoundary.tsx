import { Component, type ErrorInfo, type ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';

interface Props {
    /** Muda a cada slide: troca de slide zera o erro do anterior. */
    resetKey: number | string;
    children: ReactNode;
}

interface State {
    failed: boolean;
    attempt: number;
}

/**
 * Se um slide ou simulador falhar (ex.: pedaço de código que não baixou), só ele cai:
 * a navegação continua funcionando e há um botão para tentar de novo.
 */
export class SlideErrorBoundary extends Component<Props, State> {
    state: State = { failed: false, attempt: 0 };

    static getDerivedStateFromError(): Partial<State> {
        return { failed: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('Slide falhou:', error, info.componentStack);
    }

    componentDidUpdate(prev: Props) {
        if (prev.resetKey !== this.props.resetKey && this.state.failed) {
            this.setState({ failed: false });
        }
    }

    private retry = () => this.setState(s => ({ failed: false, attempt: s.attempt + 1 }));

    render() {
        if (!this.state.failed) {
            return <div key={this.state.attempt}>{this.props.children}</div>;
        }
        return (
            <div className="w-full max-w-3xl mx-auto py-24 text-center">
                <p className="font-display text-4xl text-white mb-4">Este slide não carregou</p>
                <p className="text-xl text-gray-300 mb-8">
                    Provavelmente a conexão caiu. As setas continuam funcionando; tente de novo quando a rede voltar.
                </p>
                <button
                    type="button"
                    onClick={this.retry}
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-lg text-white bg-brand-deep/50 border border-brand-accent/60 hover:bg-brand-deep/70"
                >
                    <RotateCcw size={18} /> Tentar de novo
                </button>
            </div>
        );
    }
}
