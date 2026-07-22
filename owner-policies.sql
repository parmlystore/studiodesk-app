-- Owner (authenticated) access — tied to studios.owner_email matching the logged-in user's email
CREATE POLICY "owner manage studios" ON studios FOR ALL USING (owner_email = auth.jwt() ->> 'email');
CREATE POLICY "owner manage studio_hours" ON studio_hours FOR ALL USING (studio_id IN (SELECT id FROM studios WHERE owner_email = auth.jwt()->>'email'));
CREATE POLICY "owner manage instructors" ON instructors FOR ALL USING (studio_id IN (SELECT id FROM studios WHERE owner_email = auth.jwt()->>'email'));
CREATE POLICY "owner manage services" ON services FOR ALL USING (studio_id IN (SELECT id FROM studios WHERE owner_email = auth.jwt()->>'email'));
CREATE POLICY "owner manage clients" ON clients FOR ALL USING (studio_id IN (SELECT id FROM studios WHERE owner_email = auth.jwt()->>'email'));
CREATE POLICY "owner manage appointments" ON appointments FOR ALL USING (studio_id IN (SELECT id FROM studios WHERE owner_email = auth.jwt()->>'email'));
CREATE POLICY "owner manage transactions" ON transactions FOR ALL USING (studio_id IN (SELECT id FROM studios WHERE owner_email = auth.jwt()->>'email'));
CREATE POLICY "owner manage stock_items" ON stock_items FOR ALL USING (studio_id IN (SELECT id FROM studios WHERE owner_email = auth.jwt()->>'email'));
CREATE POLICY "owner manage todos" ON todos FOR ALL USING (studio_id IN (SELECT id FROM studios WHERE owner_email = auth.jwt()->>'email'));
CREATE POLICY "owner manage booking_settings" ON booking_settings FOR ALL USING (studio_id IN (SELECT id FROM studios WHERE owner_email = auth.jwt()->>'email'));
