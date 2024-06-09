import Logo, { LogoSize } from "./Logo";
import Container from "./Container";

const Navbar = () => {
  return (
    <nav className="relative">
      <div className="fixed top-0 left-0 right-0 bg-violet-900 py-3">
        <Container>
          <span>
            <Logo
              size={LogoSize.REGULAR}
            />
          </span>
        </Container>
      </div>
    </nav>
  )
}

export default Navbar;
