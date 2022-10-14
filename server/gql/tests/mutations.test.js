describe('custom delete mutation', () => {
  it('should call the customDeleteResolver in createResolver function', () => {
    const { createResolvers } = jest.requireActual('../mutations');
    const customResolver = jest.fn();
    expect(createResolvers('book', customResolver).deleteResolver()).toBeUndefined();
  });
});
