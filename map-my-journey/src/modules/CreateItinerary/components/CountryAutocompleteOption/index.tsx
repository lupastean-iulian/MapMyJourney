
export const CountryOption: React.FC<{ name: string; flag: string }> = ({ name, flag }) => (
    <span style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}>
        <span style={{ fontSize: 22, marginRight: 8 }}>{flag}</span>
        {name}
    </span>
);