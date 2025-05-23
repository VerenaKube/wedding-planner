import {render, screen} from '@testing-library/react';
import Footer from '../views/Footer';
import {describe, expect, it} from 'vitest';

describe('Footer', () => {
    it('renders the footer with copyright text', () => {
        render(<Footer/>);

        const footerText = screen.getByText(/© 2025 Verena und René Kube/i);
        expect(footerText).toBeInTheDocument();
    });

    it('has the correct styling classes', () => {
        render(<Footer/>);

        const navElements = screen.getAllByRole('navigation');
        expect(navElements[0]).toHaveClass('fixed', 'bottom-0');

    });
});
