import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import TimezoneSelector from './TimezoneSelector';

// Mock fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
            {
                value: "India Standard Time",
                abbr: "IST",
                offset: 5.5,
                isdst: false,
                text: "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi",
                utc: ["Asia/Kolkata", "Asia/Calcutta"]
            },
            {
                value: "Eastern Standard Time",
                abbr: "EST",
                offset: -5,
                isdst: false,
                text: "(UTC-05:00) Eastern Time (US & Canada)",
                utc: ["America/New_York"]
            }
        ]),
    })
);

describe('TimezoneSelector', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test('renders and fetches timezones', async () => {
        await act(async () => {
            render(<TimezoneSelector onAddClock={() => { }} selectedTimezones={[]} isDarkMode={false} />);
        });

        const addButton = screen.getByText(/Add Clock/i);
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(screen.getByText(/Kolkata/i)).toBeInTheDocument();
            expect(screen.getByText(/New York/i)).toBeInTheDocument();
        });
    });

    test('filters by city name (Kolkata)', async () => {
        await act(async () => {
            render(<TimezoneSelector onAddClock={() => { }} selectedTimezones={[]} isDarkMode={false} />);
        });

        fireEvent.click(screen.getByText(/Add Clock/i));

        const searchInput = screen.getByPlaceholderText(/Search city, country.../i);
        fireEvent.change(searchInput, { target: { value: 'Kolkata' } });

        await waitFor(() => {
            expect(screen.getByText(/Kolkata/i)).toBeInTheDocument();
            expect(screen.queryByText(/New York/i)).not.toBeInTheDocument();
        });
    });

    test('filters by abbreviation (IST)', async () => {
        await act(async () => {
            render(<TimezoneSelector onAddClock={() => { }} selectedTimezones={[]} isDarkMode={false} />);
        });

        fireEvent.click(screen.getByText(/Add Clock/i));

        const searchInput = screen.getByPlaceholderText(/Search city, country.../i);
        fireEvent.change(searchInput, { target: { value: 'IST' } });

        await waitFor(() => {
            expect(screen.getByText(/Kolkata/i)).toBeInTheDocument();
            expect(screen.queryByText(/New York/i)).not.toBeInTheDocument();
        });
    });

    test('filters by value (India Standard Time)', async () => {
        await act(async () => {
            render(<TimezoneSelector onAddClock={() => { }} selectedTimezones={[]} isDarkMode={false} />);
        });

        fireEvent.click(screen.getByText(/Add Clock/i));

        const searchInput = screen.getByPlaceholderText(/Search city, country.../i);
        fireEvent.change(searchInput, { target: { value: 'India Standard Time' } });

        await waitFor(() => {
            expect(screen.getByText(/Kolkata/i)).toBeInTheDocument();
            expect(screen.queryByText(/New York/i)).not.toBeInTheDocument();
        });
    });

    test('filters by text content (Chennai)', async () => {
        await act(async () => {
            render(<TimezoneSelector onAddClock={() => { }} selectedTimezones={[]} isDarkMode={false} />);
        });

        fireEvent.click(screen.getByText(/Add Clock/i));

        const searchInput = screen.getByPlaceholderText(/Search city, country.../i);
        fireEvent.change(searchInput, { target: { value: 'Chennai' } });

        await waitFor(() => {
            expect(screen.getByText(/Kolkata/i)).toBeInTheDocument();
            expect(screen.queryByText(/New York/i)).not.toBeInTheDocument();
        });
    });
});
