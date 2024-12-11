import {
  Typography,
  Container,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const TermsOfService = () => {
  return (
    <Container sx={{ textAlign: "left" }}>
      <Typography variant="h4" gutterBottom>
        Website Terms and Conditions of Use
      </Typography>
      <Typography variant="h5" gutterBottom>
        1. Terms
      </Typography>
      <Typography variant="body1" paragraph>
        By accessing this Website, accessible from{" "}
        <a href="https://swipeandfly.world">swipeandfly.world</a>, you are
        agreeing to be bound by these Website Terms and Conditions of Use and
        agree that you are responsible for the agreement with any applicable
        local laws. If you disagree with any of these terms, you are prohibited
        from accessing this site. The materials contained in this Website are
        protected by copyright and trade mark law.
      </Typography>

      <Typography variant="h5" gutterBottom>
        2. Use License
      </Typography>
      <Typography variant="body1" paragraph>
        Permission is granted to temporarily download one copy of the materials
        on VietRocHack's Website for personal, non-commercial transitory viewing
        only. This is the grant of a license, not a transfer of title, and under
        this license you may not:
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="modify or copy the materials;" />
        </ListItem>
        <ListItem>
          <ListItemText primary="use the materials for any commercial purpose or for any public display;" />
        </ListItem>
        <ListItem>
          <ListItemText primary="attempt to reverse engineer any software contained on VietRocHack's Website;" />
        </ListItem>
        <ListItem>
          <ListItemText primary="remove any copyright or other proprietary notations from the materials; or" />
        </ListItem>
        <ListItem>
          <ListItemText primary='transferring the materials to another person or "mirror" the materials on any other server.' />
        </ListItem>
      </List>
      <Typography variant="body1" paragraph>
        This will let VietRocHack terminate upon violations of any of these
        restrictions. Upon termination, your viewing right will also be
        terminated and you should destroy any downloaded materials in your
        possession whether it is printed or electronic format.
      </Typography>

      <Typography variant="h5" gutterBottom>
        3. Disclaimer
      </Typography>
      <Typography variant="body1" paragraph>
        All the materials on VietRocHack's Website are provided “as is”.
        VietRocHack makes no warranties, may it be expressed or implied,
        therefore negates all other warranties. Furthermore, VietRocHack does
        not make any representations concerning the accuracy or reliability of
        the use of the materials on its Website or otherwise relating to such
        materials or any sites linked to this Website.
      </Typography>

      <Typography variant="h5" gutterBottom>
        4. Limitations
      </Typography>
      <Typography variant="body1" paragraph>
        VietRocHack or its suppliers will not be held accountable for any
        damages that will arise with the use or inability to use the materials
        on VietRocHack's Website, even if VietRocHack or an authorized
        representative of this Website has been notified, orally or written, of
        the possibility of such damage. Some jurisdictions do not allow
        limitations on implied warranties or limitations of liability for
        incidental damages, these limitations may not apply to you.
      </Typography>

      <Typography variant="h5" gutterBottom>
        5. Revisions and Errata
      </Typography>
      <Typography variant="body1" paragraph>
        The materials appearing on VietRocHack's Website may include technical,
        typographical, or photographic errors. VietRocHack will not promise that
        any of the materials in this Website are accurate, complete, or current.
        VietRocHack may change the materials contained on its Website at any
        time without notice. VietRocHack does not make any commitment to update
        the materials.
      </Typography>

      <Typography variant="h5" gutterBottom>
        6. Links
      </Typography>
      <Typography variant="body1" paragraph>
        VietRocHack has not reviewed all of the sites linked to its Website and
        is not responsible for the contents of any such linked site. The
        presence of any link does not imply endorsement by VietRocHack of the
        site. The use of any linked website is at the user's own risk.
      </Typography>

      <Typography variant="h5" gutterBottom>
        7. Site Terms of Use Modifications
      </Typography>
      <Typography variant="body1" paragraph>
        VietRocHack may revise these Terms of Use for its Website at any time
        without prior notice. By using this Website, you are agreeing to be
        bound by the current version of these Terms and Conditions of Use.
      </Typography>

      <Typography variant="h5" gutterBottom>
        8. Governing Law
      </Typography>
      <Typography variant="body1" paragraph>
        Any claim related to VietRocHack's Website shall be governed by the laws
        of the country without regards to its conflict of law provisions.
      </Typography>
    </Container>
  );
};

export default TermsOfService;
