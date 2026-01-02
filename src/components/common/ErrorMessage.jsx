export default function ErrorMessage ({error}) {
    return <p style={{ color : '#f00' }}>{ error?.statusText || error?.message }</p>
} 