import Logo, { LogoSize } from "./Logo";
import Container from "./Container";

const Navbar = () => {
  return (
    <nav className="bg-violet-900 py-3">
      <Container>
        <span>
          <Logo
            size={LogoSize.REGULAR}
          />
        </span>
      </Container>
    </nav>
  )
}

export default Navbar;
